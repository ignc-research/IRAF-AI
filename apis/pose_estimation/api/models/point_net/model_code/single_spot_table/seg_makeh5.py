#################################################################
# Make pcd point cloud files into h5 format dataset for         # 
# semantic segmentation training and testing                    #
#################################################################
import os
import sys
import numpy as np
import h5py
import open3d as o3d
import random
import copy
import datetime
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE_DIR)
sys.path.append(os.path.join(ROOT,'utils'))
sys.path.append(os.path.join(ROOT,'pointnet2','utils'))
from hdf5_util import *
from foundation import points2pcd, load_pcd_data

output_filename_prefix = 'data/dataset/seg_dataset'


def processData(path, path_aug, crop_size=400, NUM_POINT=2048):
    """Scale point clouds, Do data copy, store the generated slices in ../data/train/aug
    
    Args:
        path (str): path to welding slices
        repeat_num (int): number of copies
        crop_size (int): side length of cutting bbox in mm 
    """
    files = os.listdir(path)
    for file in files:
        if os.path.splitext(file)[1] == '.pcd':
            pts = load_pcd_data(os.path.join(path,file))
            data = pts[:,0:4]
            xyzl = data.copy()
            # print (xyzl.shape)
            center = 0.5 * (np.max(xyzl,axis=0) + np.min(xyzl,axis=0))[0:3]
            xyzl[:,0:3] -= center
            np.random.shuffle(xyzl)
            xyzl_d = xyzl[0:NUM_POINT,:]
            ratio = 1/crop_size
            xyzl_d[:,0:3] *= ratio                
            points2pcd(os.path.join(path_aug,os.path.splitext(file)[0]+'.pcd'),xyzl_d)


def wirteFiles(path):
    """Separate training set(80%) and test set(20%)
    there is no necessary to make a val set
    """
    for root, dirs, files in os.walk(path):
        files.sort()
        for file in files:
            rdm = random.random()
            if 0 <= rdm < 0.8:
                f = open(os.path.join(os.path.dirname(path),'train.txt'),'a') 
                f.write(path+'/'+file+'\n')
                f.close()
            else:
                f = open(os.path.join(os.path.dirname(path),'test.txt'),'a') 
                f.write(path+'/'+file+'\n')
                f.close()



def write_data_label_hdf5(filelist, filename_prefix, NUM_POINT):
    """Store pcd point clouds as h5 format dataset
    """
    data_filenames = [line.rstrip() for line in open(filelist, 'r')]
    print (data_filenames)
    N = len(data_filenames)
    # assert(N<=10000)
    # assert(N==len(labels))
    
    h5_batch_size = 10000
    
    data_dim = [NUM_POINT,3]
    label_dim = [NUM_POINT,1]
    data_dtype = 'float64'
    label_dtype = 'uint8'

    batch_data_dim = [min(h5_batch_size,N)] + data_dim
    batch_label_dim = [min(h5_batch_size,N)] + label_dim
    h5_batch_data = np.zeros(batch_data_dim)
    h5_batch_label = np.zeros(batch_label_dim)
    print (batch_data_dim)
    print (batch_label_dim)

    for k in range(N):
        data = load_pcd_data(data_filenames[k])
        np.random.shuffle(data)
        d = data[0:NUM_POINT,0:3]
        l = data[0:NUM_POINT,3:4]
        h5_batch_data[k%h5_batch_size, ...] = d
        h5_batch_label[k%h5_batch_size, ...] = l
        if (k+1)%h5_batch_size == 0 or k==N-1:
            print ('[%s] %d/%d' % (datetime.datetime.now(), k+1, N))
            print ('batch data shape: ', h5_batch_data.shape)
            h5_filename = filename_prefix+str(int(k/h5_batch_size))+'.h5'
            print (h5_filename)
            print (np.shape(h5_batch_data))
            print (np.shape(h5_batch_label))
            begidx = 0
            endidx = min(h5_batch_size, (k%h5_batch_size)+1)
            print (h5_filename, data_dtype, label_dtype)
            save_h5(h5_filename, h5_batch_data[begidx:endidx,:], h5_batch_label[begidx:endidx,:], data_dtype, label_dtype)
            f = open(filename_prefix[:-1]+'.txt','a')
            f.write(h5_filename+'\n')



if __name__ == "__main__":
    
    path = os.path.join(ROOT,'data/train/welding_zone_comp')  
    path_aug = os.path.join(ROOT,'data/train','aug')
    path_dataset = os.path.join(ROOT, 'data/train', 'dataset')
    if not os.path.exists(path_aug):
        os.makedirs(path_aug)
    if not os.path.exists(path_dataset):
        os.makedirs(path_dataset)
    
    # random scale and augmentation     
    processData(path,repeat_num = 1, NUM_POINT = 2048)
    # split trainset and testset
    wirteFiles(path_aug)
    # wirte h5 format file
    write_data_label_hdf5(os.path.join(ROOT,'data/train','train.txt'), '../data/train/dataset/seg_dataset_train_',2048)
    write_data_label_hdf5(os.path.join(ROOT,'data/train','test.txt'), '../data/train/dataset/seg_dataset_test_',2048)
    # delete middle files
    os.system('rm -rf ../data/train/aug')

