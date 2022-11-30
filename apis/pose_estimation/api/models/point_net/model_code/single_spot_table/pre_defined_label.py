#################################################################
                                #
#################################################################

import os
import sys
import pickle

CURRENT_PATH = os.path.abspath(__file__)
BASE = os.path.dirname(CURRENT_PATH) 
ROOT = os.path.dirname(BASE)
sys.path.insert(0,os.path.join(ROOT,'utils'))


class PDL():
    '''Labeling with pre-defined labels
    
    Splitting assemblies, extracting hybrid feature descriptors for clustering, and generating labels
    
    Attributes:
        path_models: Path to single model folder containing dwg, obj, mtl and xml files
        path_split: Path to the folder which stores the mesh model of the disassembled parts
        path_classes: Path to the final classification results
    
    '''
    def __init__(self, 
                 path_models:str,
                 path_split:str,
                 path_classes: str):
        self.path_models = path_models
        self.path_split = path_split
        self.path_classes = path_classes
        # save class list
        # components = os.listdir(self.path_models)
        # class_dict = {}
        # label_count = 0
        # for component in components:
        #     with open(os.path.join(self.path_models, component, component+'.obj'), 'r') as f:
        #         for line in f.readlines():
        #             if line[0:7] == 'usemtl ':
        #                 if not line[7:-1] in class_dict.keys():
        #                     class_dict[line[7:-1]] = label_count
        #                     label_count += 1
        # print (class_dict)
        if not os.path.exists(self.path_classes):
            os.makedirs(self.path_classes)
        # with open(os.path.join(self.path_classes, 'class_dict.pkl'), 'wb') as tf:
        #     pickle.dump(class_dict,tf,protocol=2)
            
    def split(self, path_file:str):
        '''Take the assembly apart
        Create a folder for each mesh file, which stores the mesh model of the disassembled parts
        Args:
            path_file (str): path to single mesh in obj format
        '''
        i=0
        idx_start = 0
        with open(path_file,'r') as f:
            count = 0
            # get the name of current component mesh
            namestr = os.path.splitext(os.path.split(path_file)[-1])[0]
            # make directory for disassembled parts
            try:
                os.makedirs(os.path.join(ROOT,self.path_split,namestr))
            except:
                print("Split folder already exits")
            # prefix of single disassembled part
            outstr = os.path.join(ROOT, self.path_split, namestr) + '/' + namestr + '_'
            for line in f.readlines():
                if line[0:1] == 'o':
                    idx_start = count
                    path_part = outstr + str(i) + '.obj'
                    i += 1
                    # create new obj file
                    g = open(path_part , 'w')
                    g.write('mtllib ' + namestr + '.mtl'+'\n')
                    g.write(line)
                elif line[0:1] == 'v':
                    if i>0:
                        # add vertices
                        g = open(outstr + str(i-1) + '.obj', 'a')
                        g.write(line)   
                    count +=1
                elif line[0:1] == 'f':
                    new_line = 'f '
                    new_line += str(int(line.split()[1])-idx_start) + ' '
                    new_line += str(int(line.split()[2])-idx_start) + ' '
                    new_line += str(int(line.split()[3])-idx_start) + '\n'
                    if i>0:
                        # define the connection of vertices using the order of the new file
                        g = open(outstr + str(i-1) + '.obj', 'a')
                        g.write(new_line)            
                else:
                    if i>0:
                        g = open(outstr + str(i-1) + '.obj', 'a')
                        g.write(line)
            # copy the mtl file to the output folder
            os.system('cp %s %s'%(os.path.join(ROOT,self.path_models,namestr,namestr+'.mtl'), 
                                  os.path.join(ROOT, self.path_split, namestr)))
    def write_all_parts(self):
        '''Get the filename of all the single plate
        Eliminate non-shaped meshes
        
        Args:
            None
        Returns:
            None
        '''
        all_components = os.listdir(self.path_split)

        with open(os.path.join(self.path_split, 'all_parts.txt'), 'w') as f:
            for component in filter(lambda x: os.path.isdir(os.path.join(self.path_split,x)), all_components):
                files = os.listdir(os.path.join(self.path_split, component))
                for file in files:
                    if os.path.splitext(file)[1] == '.obj':                
                        content = open(os.path.join(self.path_split, component, file), 'r')
                        lines = content.readlines()
                        # ignore some noise mesh faces
                        if len(lines) > 10:
                            f.writelines(os.path.join(self.path_split, component, file)+'\n')
    def label(self):
        class_dict = {}
        files = open(os.path.join(ROOT, self.path_split, 'all_parts.txt'), 'r').readlines()
        for file in files:
            with open(file.strip(), 'r') as f:               
                for line in f.readlines():
                    if line[0:7] == 'usemtl ':
                        class_dict[file.strip()] = line[7:-1]
        with open(os.path.join(self.path_classes,'class_dict.pkl'), 'wb') as tf:
            pickle.dump(class_dict,tf,protocol=2)
        for key in class_dict:
            class_dir = os.path.join(self.path_classes, class_dict[key])
            if not os.path.exists(class_dir):
                os.makedirs(class_dir)
            print(key)
            print(class_dir)
            os.system('cp %s %s'%(key, class_dir))


if __name__ == '__main__':
    pfe = PDL(path_models=os.path.join(ROOT, 'data', 'train', 'models'),
              path_split=os.path.join(ROOT, 'data', 'train', 'split'),
              path_classes=os.path.join(ROOT, 'data', 'train', 'parts_classification'))
    components = os.listdir(pfe.path_models)
    for comp in components:
        path_to_comp = os.path.join(pfe.path_models, comp)
        files = os.listdir(path_to_comp)
        for file in files:
            if os.path.splitext(file)[1] == '.obj':
                pfe.split(os.path.join(path_to_comp, file))
    pfe.write_all_parts()
    pfe.label()