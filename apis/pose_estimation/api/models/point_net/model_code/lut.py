import os
import sys
import pickle
import time

CURRENT_PATH = os.path.abspath(__file__)
BASE = os.path.dirname(CURRENT_PATH) 

sys.path.insert(0,os.path.join(BASE,'utils'))
sys.path.insert(0,os.path.join(BASE,'single_spot_table'))
from pre_defined_label import PDL
from obj_sample_and_autolabel import sample_and_label
import slice

class LookupTable():
    '''Lookup Table
    Mesh transformation, slicing, making lookup tables
    
    Attributes:
        path_data: The path to the data folder, see readme for the specific directory structure
        label: Labeling methods, there are 'PDL' and 'HFD'. PDL is pre-defined lable, 
               if the color (material) of the parts of assemblies in the CAD design is 
               differentiated according to the different kinds of parts, use PDL. HFD 
               uses hybrid feature descriptors to cluster the parts of the assemblies, 
               use it by running obj_geo_based_classification.py to generate the class-
               ification first, then enter the classification directory in arg hfd_path_classes
        hfd_path_classes: Path to the classification result by HFD method. The default folder is
                          "./data/train/parts_classification"
        pcl_density: A parameter that controls the density of the point cloud, the smaller 
                     the value the higher the density
        crop_size: Edge lengths of point cloud slices in millimeters
        num_points: Number of points contained in the point cloud slice 
    '''
    def __init__(self, 
                 path_data:str,
                 label:str,
                 hfd_path_classes:str='./data/train/parts_classification',
                 pcl_density:int=40,
                 crop_size:int=400,
                 num_points:int=2048):
        self.path_data = path_data
        self.path_train = os.path.join(self.path_data, 'train')
        self.path_models = os.path.join(self.path_train, 'models')
        self.label = label
        self.path_classes = None
        self.hfd_path_classes = hfd_path_classes
        self.pcl_density = pcl_density
        self.crop_size = crop_size
        self.num_points = num_points
        # Make sure the directory structure is correct
        components = os.listdir(self.path_models)
        for component in components:
            files = os.listdir(os.path.join(self.path_models, component))
            for file in files:
                if os.path.splitext(file)[-1] == '.obj':
                    old_name = os.path.splitext(file)[0]
                    if not old_name == component:
                        os.rename(os.path.join(self.path_models,component,file),os.path.join(self.path_models,component,component+'.obj'))
                    file_data = ''
                    with open(os.path.join(self.path_models,component,component+'.obj'), 'r') as f:                        
                        for line in f:
                            if '.mtl' in line:
                                file_data += 'mtllib '+component+'.mtl\n'
                            else:                                
                                file_data += line                    
                    with open(os.path.join(self.path_models,component,component+'.obj'), 'w') as f:
                        f.write(file_data)
                if os.path.splitext(file)[-1] == '.xml':
                    old_name = os.path.splitext(file)[0]
                    if not old_name == component:
                        os.rename(os.path.join(self.path_models,component,file),os.path.join(self.path_models,component,component+'.xml'))
                if os.path.splitext(file)[-1] == '.mtl':
                    old_name = os.path.splitext(file)[0]
                    if not old_name == component:
                        os.rename(os.path.join(self.path_models,component,file),os.path.join(self.path_models,component,component+'.mtl'))
    def make(self):
        if self.label == 'PDL':
            self.path_classes = os.path.join(self.path_data, 'train', 'parts_classification')
            pdl = PDL(path_models=os.path.join(self.path_data, 'train', 'models'),
                path_split=os.path.join(self.path_data, 'train', 'split'),
                path_classes=self.path_classes)

                
            components = os.listdir(pdl.path_models)
            for comp in components:
                path_to_comp = os.path.join(pdl.path_models, comp)
                files = os.listdir(path_to_comp)
                for file in files:
                    if os.path.splitext(file)[1] == '.obj':
                        pdl.split(os.path.join(path_to_comp, file))

            pdl.write_all_parts()
            pdl.label()
        elif self.label == 'HFD':
            self.path_classes = self.hfd_path_classes
        else:
            raise NotImplementedError

        f = open(os.path.join(self.path_classes, 'class_dict.pkl'), 'rb')
        class_dict = pickle.load(f)

        # a dict that stores current labels
        label_dict = {}
        i = 0
        for v in class_dict.values():
            if v not in label_dict:
                label_dict[v] = i
                i += 1
        with open(os.path.join(self.path_classes, 'label_dict.pkl'), 'wb') as tf:
            pickle.dump(label_dict,tf,protocol=2)
        # load the parts and corresponding labels from part feature extractor
        f = open(os.path.join(self.path_classes, 'label_dict.pkl'), 'rb')
        label_dict = pickle.load(f)
        label_dict_r = dict([val, key] for key, val in label_dict.items())   

        # path to disassembled parts
        path_split = os.path.join(self.path_train, 'split')
        # folder to save unlabeled pc in xyz format
        path_xyz = os.path.join(self.path_train, 'unlabeled_pc')
        # folder to save labeled pc in pcd format
        path_pcd = os.path.join(self.path_train, 'labeled_pc')
        if not os.path.exists(path_xyz):
            os.makedirs(path_xyz)
        if not os.path.exists(path_pcd):
            os.makedirs(path_pcd)
        folders = os.listdir(path_split)

        for folder in folders:
            # for each component merge the labeled part mesh and sample mesh into pc
            if os.path.isdir(os.path.join(path_split, folder)):
                print ('sampling... ...', folder)
                print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
                sample_and_label(os.path.join(path_split, folder), path_pcd, path_xyz, label_dict, class_dict, self.pcl_density)


        # path to dir of welding slices
        path_welding_zone = os.path.join(self.path_train, 'welding_zone')
        # path to lookup table
        path_lookup_table = os.path.join(self.path_train, 'lookup_table')
        if not os.path.exists(path_welding_zone):
            os.makedirs(path_welding_zone)
        if not os.path.exists(path_lookup_table):
            os.makedirs(path_lookup_table)
        files = os.listdir(self.path_models)
        print ('Generate one point cloud slice per welding spot')
        i = 1
        for file in files:
                print (str(i)+'/'+str(len(files)), file)
                i += 1
                print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))      
                pc_path = os.path.join(path_pcd, file+'.pcd')
                xml_path = os.path.join(self.path_models, file, file+'.xml')
                name = file
                slice.slice_one(pc_path, path_welding_zone, path_lookup_table, xml_path, name, self.crop_size, self.num_points)
        
        slice.merge_lookup_table(path_lookup_table)
        print ('Extract feature dictionary from point cloud slices\n')
        slice.get_feature_dict(self.path_data, path_welding_zone, path_lookup_table, label_dict_r)
        print ('Removing duplicate point cloud slices\n')
        slice.decrease_lib(self.path_data, self.path_train, path_welding_zone, label_dict_r)
        slice.move_files(self.path_data)
        print ('Use the normal information to generate an index for easy searching\n')
        slice.norm_index(self.path_data)
        print('FINISHED')
            

if __name__ == '__main__':
    lut = LookupTable(path_data='./data', label='PDL', hfd_path_classes=None, pcl_density=40, crop_size=400, num_points=2048)
    lut.make()