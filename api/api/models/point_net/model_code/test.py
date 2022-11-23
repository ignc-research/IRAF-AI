import os
import pickle
import subprocess
import sys
import time
from xml.dom.minidom import Element
import xml.etree.ElementTree as et

CURRENT_PATH = os.path.abspath(__file__)
BASE = os.path.dirname(CURRENT_PATH) 

sys.path.insert(0,os.path.join(BASE,'utils'))
sys.path.insert(0,os.path.join(BASE,'single_spot_table'))
from test_preprocessing import sample_test_pc, slice_test

class PoseLookup():
    def __init__(self,
                 path_data):
        '''Lookup a best torch pose for test input
            
        Attributes:
            path_data: The path to the data folder, see readme for the specific directory structure
        '''
        self.path_data = path_data
        self.path_test = os.path.join(self.path_data, 'test')
        self.path_models = os.path.join(self.path_test, 'models')
        self.path_dataset = os.path.join(self.path_test, 'dataset')
        if not os.path.exists(self.path_dataset):
            os.makedirs(self.path_dataset)

    def preprocessing(self,
                      path_test_component,
                      pcl_density = 40,
                      crop_size = 400,
                      num_points = 2048):
        '''Sampling and slicing for test component
        
        Args:
            path_test_component: path to the test component
            pcl_density: A parameter that controls the density of the point cloud, the smaller 
                         the value the higher the density
            crop_size: Edge lengths of point cloud slices in millimeters. Must be consistent
                            with the values used in the previous lookup table creation [default: 400]
            num_points: Number of points contained in the point cloud slice  [default: 2048]
        '''
        component = os.path.split(path_test_component)[-1]
        files = os.listdir(path_test_component)
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

        print ('sampling... ...', component)
        print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
        sample_test_pc(path_test_component, pcl_density)
        path_pc = os.path.join(self.path_models, component, component+'.xyz')   
        path_xml = os.path.join(self.path_models, component, component+'.xml')
        path_wztest = os.path.join(self.path_test, 'welding_zone_test', component)
        if not os.path.exists(path_wztest):
            os.makedirs(path_wztest)
            print ('slicing... ...', component)
            print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
            slice_test(path_pc, path_xml, path_wztest, crop_size, num_points)
    
    def copy_vec(self, from_vec: et.Element, to_vec: et.Element):
        to_vec.set("X", from_vec.get("X"))
        to_vec.set("Y", from_vec.get("Y"))
        to_vec.set("Z", from_vec.get("Z"))

    def copy_frame(self, from_frame: et.Element, to_frame: et.Element, name: str):
        self.copy_vec(from_frame.find(name), to_frame.find(name))

    def get_result_xml(self,component_name):
        result_dir = f"{self.path_data}/test/results/{component_name}"
        tree = et.parse(f"{self.path_data}/test/models/{component_name}/{component_name}.xml")

        elems = list(filter(lambda x: x.split(".")[-1] == "xml" and x.split(".")[0] != component_name , os.listdir(result_dir)))
        print(len(elems))

        root = tree.getroot()

        print(len(root.findall('.//Frame')))

        for idx, frame in enumerate(root.findall('.//Frame')):
            result_file = elems[idx]
            result_tree = et.parse(f"{result_dir}/{result_file}")
            result_frame = result_tree.getroot().find(".//Frame")

            self.copy_frame(result_frame, frame, "Pos")
            self.copy_frame(result_frame, frame, "XVek")
            self.copy_frame(result_frame, frame, "YVek")
            self.copy_frame(result_frame, frame, "ZVek") 

        return et.tostring(root, encoding='unicode', method='xml')


    def inference(self,
                data_path,
                  model_path,
                  test_input,
                  test_one_component):
        '''test a component
        
        Args:os.
            model_path: path to the pn++ model [default: './data/seg_model/model1.ckpt']
            test_input: path to the folder of welding slices for testing [default: './data/test/welding_zone_test']
            test_one_component: if only one component will be tested, enter the path here [default: None]
        '''
        args = [f"--model_path={model_path}", f"--data_path={data_path}", f"--test_input={test_input}", f"--test_one_component={test_one_component}"]

        process = subprocess.Popen(['conda', 'run', '--cwd', BASE, '-n', 'py27', 'python', './single_spot_table/seg_infer.py'] + args, cwd=BASE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        for line in process.stdout:
            print(line.decode("utf-8"))
        
        
if __name__ == '__main__':
    te = PoseLookup(path_data='./data')
    te.preprocessing('./data/test/models/201910292399')