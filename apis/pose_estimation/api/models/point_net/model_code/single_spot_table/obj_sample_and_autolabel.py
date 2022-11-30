#################################################################
# Merge disassembled parts with labels and sample point clouds  #
# with adjustable sampling density.                             #
#################################################################

import os
import sys
import open3d as o3d
import numpy as np
import time
import pickle
CURRENT_PATH = os.path.abspath(__file__)
BASE = os.path.dirname(CURRENT_PATH) # dir /utils
ROOT = os.path.dirname(BASE) # dir /lookup_table
sys.path.insert(0,os.path.join(ROOT,'utils'))
from math_util import get_projections_of_triangle, get_angle
from foundation import points2pcd

PATH_COMP = '../data/train/models'
PATH_XYZ = '../data/train/unlabeled_pc'
PATH_PCD = '../data/train/labeled_pc' 

def sample_and_label(path, path_pcd, path_xyz, label_dict, class_dict, density=40):
    '''Convert mesh to pointcloud
    two pc will be generated, one is .pcd format with labels, one is .xyz format withou labels
    Args:
        path (str): path to single component
        label_dict (dict): the class name with an index
        density (int): Sampling density, the smaller the value the greater the point cloud density
    '''

    print(f"SAMPLE AND LABEL {path} {path_pcd} {path_xyz}")

    # get the current component name
    namestr = os.path.split(path)[-1]
    files = os.listdir(path)
    # label_list = {}
    label_count = 0

    allpoints = np.zeros(shape=(1,4))
    for file in files:
        if os.path.splitext(file)[1] == '.obj':
            # load mesh
            mesh = o3d.io.read_triangle_mesh(os.path.join(path, file))
            if np.asarray(mesh.triangles).shape[0] > 1:
                # KKI: Why absolute??
                #key = os.path.abspath(os.path.join(path, file))

                key = os.path.join(path, file)
                label = label_dict[class_dict[key]]

                # get number of points according to surface area
                number_points = int(mesh.get_surface_area()/density) 
                # poisson disk sampling
                pc = mesh.sample_points_poisson_disk(number_points, init_factor=5)
                xyz = np.asarray(pc.points)
                l = label * np.ones(xyz.shape[0])
                xyzl = np.c_[xyz, l]
                #print (file, 'sampled point cloud: ', xyzl.shape)
                allpoints = np.concatenate((allpoints, xyzl), axis=0)
    points2pcd(os.path.join(path_pcd, namestr+'.pcd'), allpoints[1:])
    pc = o3d.geometry.PointCloud()
    pc.points = o3d.utility.Vector3dVector(allpoints[1:,0:3])
    o3d.io.write_point_cloud(os.path.join(path_xyz, namestr+'.xyz'),pc)


if __name__ == '__main__':
    # load the parts and corresponding labels from part feature extractor
    f = open('../data/train/parts_classification/class_dict.pkl', 'rb')
    classdict = pickle.load(f)
    # a dict that stores current labels
    label_dict = {}
    i = 0
    for v in classdict.values():
        if v not in label_dict:
            label_dict[v] = i
            i += 1
    with open(os.path.join('../data/train/parts_classification/label_dict.pkl'), 'wb') as tf:
        pickle.dump(label_dict,tf,protocol=2)

    # path to disassembled parts
    path = '../data/train/split'
    # folder to save unlabeled pc in xyz format
    path_xyz = '../data/train/unlabeled_pc'
    # folder to save labeled pc in pcd format
    path_pcd = '../data/train/labeled_pc'    
    if not os.path.exists(path_xyz):
        os.makedirs(path_xyz)
    if not os.path.exists(path_pcd):
        os.makedirs(path_pcd)
    folders = os.listdir(path)
    count = 0
    total = len(folders)
    for folder in folders:
        # for each component merge the labeled part mesh and sample mesh into pc
        if os.path.isdir(os.path.join(path, folder)):
            count += 1
            print ('sampling... ...', folder)
            print (str(count)+'/'+str(total-2))
            print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
            sample_and_label(os.path.join(path, folder),PATH_PCD, PATH_XYZ, label_dict, classdict)
    

    # =======================================================
    # for test data
    # path = '../data/test/models'
    # path_xyz = '../data/test/pc'
    # if not os.path.exists(path_xyz):
    #     os.makedirs(path_xyz)
    # folders = os.listdir(path)
    # count = 0
    # total = len(folders)
    # for folder in folders:
    #     count += 1
    #     print ('sampling... ...', folder)
    #     print (str(count)+'/'+str(total))
    #     print(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
    #     sample_test_pc(os.path.join(path, folder))
