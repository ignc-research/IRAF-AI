import tensorflow as tf
import os
import numpy as np
import argparse
from sklearn.cluster import DBSCAN
import open3d as o3d
import pickle
from xml.dom.minidom import Document
import copy
import time
import random
import sys
import scipy.linalg as linalg
import math
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE_DIR)
TF_OPS_DIR = os.path.join(ROOT, 'pointnet2', 'tf_ops')
parser = argparse.ArgumentParser()
parser.add_argument('--data_path', default='../data', help='Data path [default: ../data]')
parser.add_argument('--model_path', default='../data/seg_model/model1.ckpt', help='model checkpoint file path [default: log/model1.ckpt]')
parser.add_argument('--test_input', default='../data/test/welding_zone_test', help='path to input test xyz file')
parser.add_argument('--test_one_component', default=None, help='path to folder of single test component')
FLAGS = parser.parse_args()


sampling_module = tf.load_op_library(os.path.join(TF_OPS_DIR, 'sampling/tf_sampling_so.so'))
grouping_module = tf.load_op_library(os.path.join(TF_OPS_DIR, 'grouping/tf_grouping_so.so'))
interpolation_module = tf.load_op_library(os.path.join(TF_OPS_DIR,'3d_interpolation/tf_interpolate_so.so'))

DATA_PATH = FLAGS.data_path
MODEL_PATH = FLAGS.model_path
INPUT_PATH = FLAGS.test_input
TEST_COMP = FLAGS.test_one_component
sys.path.append(os.path.join(ROOT,'utils'))
sys.path.append(os.path.join(ROOT,'pointnet2','utils'))
from hdf5_util import *
from foundation import draw, fps, load_pcd_data, fps
from xml_parser import list2array, parse_frame_dump
from math_util import rotate_mat
# load label dictionary

f = open(os.path.join(DATA_PATH, 'train/parts_classification/label_dict.pkl'), 'rb')
lable_list = pickle.load(f)
labeldict = dict([val, key] for key, val in lable_list.items())   


class Model():
    '''Import model
    '''
    def __init__(self, PATH_TO_CKPT):
        self.graph = tf.Graph()
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        config.log_device_placement = False
        config.allow_soft_placement = True
    
        self.sess = tf.Session(graph=self.graph, config=config)
        with self.graph.as_default():
            saver = tf.train.import_meta_graph(PATH_TO_CKPT + '.meta', clear_devices=True)
            saver.restore(self.sess, PATH_TO_CKPT)
    
    def run(self, input_data, is_training):
        input_points = self.graph.get_tensor_by_name('Placeholder:0')
        training = self.graph.get_tensor_by_name('Placeholder_2:0')
        feature = self.graph.get_tensor_by_name('Reshape:0')
        return self.sess.run(feature, feed_dict={input_points:input_data,training:is_training})
    
    def run_cls(self, input_data,l,is_training):
        input_points = self.graph.get_tensor_by_name('Placeholder:0')
        labels = self.graph.get_tensor_by_name('Placeholder_1:0')
        training = self.graph.get_tensor_by_name('Placeholder_2:0')
        cls = self.graph.get_tensor_by_name('ArgMax:0')

        # cls = self.graph.get_tensor_by_name('Equal:0')
        return self.sess.run(cls, feed_dict={input_points:input_data,labels:l,training:is_training})


def get_feature_dict_sep(xyz, label, normals, torch):
    '''Generate the feature dict for tested slice, the dict contains
    the nummber of each class and the coordinates of bounding box of each cluster of class'''
    feature_dict = {}
    elements = []
    feature_dict['normals'] = normals.astype(float)
    feature_dict['torch'] = torch
    min_edge = np.min(np.max(xyz, axis=0)-np.min(xyz, axis=0))
    for i in range(len(labeldict)):
        idx = np.argwhere(label==i)
        idx = np.squeeze(idx)
        l_i = label[idx]
        xyz_i = xyz[idx]
        if xyz_i.shape[0]>10:
            eps = min_edge / 2
            c = DBSCAN(eps=eps, min_samples=10).fit(xyz_i)
            number = c.labels_.max()+1
            feature_info = np.zeros(shape = (number, 8, 3), dtype = float)
            for _ in range(number):
                idx_f = np.argwhere(c.labels_==_)
                idx_f = np.squeeze(idx_f)
                xyz_f = xyz_i[idx_f] # each cluster of each class
                l_f = l_i[idx_f]
                geometry = o3d.geometry.PointCloud()
                geometry.points = o3d.utility.Vector3dVector(xyz_f)
                bbox = geometry.get_axis_aligned_bounding_box()
                elements.append(geometry)
                elements.append(bbox)            
                feature_info[_,:,:] = np.asarray(bbox.get_box_points())
            feature_dict[labeldict[i]] = feature_info
        else:
            feature_dict[labeldict[i]] = None
    return feature_dict

def similarity_sep(feature_dict1, feature_dict2):
    '''Comparing the differences between two feature dictionaries using Euclidean distance
    '''
    loss_amount = 0
    loss_geo = 0
    loss_norm = 0
    norm1 = feature_dict1['normals']
    norm2 = feature_dict2['normals']
    loss_norm = np.sum((norm1-norm2)**2)
    torch1 = feature_dict1['torch']
    torch2 = feature_dict2['torch']
    loss_torch = (torch1-torch2)**2
    for i in range(len(labeldict)):
        # print feature_dict1[labeldict[i]]
        # get the number of each class
        if type(feature_dict1[labeldict[i]]) == type(None):
            class_num_1_cur = 0
        else:
            class_num_1_cur = feature_dict1[labeldict[i]].shape[0]
            
        if type(feature_dict2[labeldict[i]]) == type(None):
            class_num_2_cur = 0
        else:
            class_num_2_cur = feature_dict2[labeldict[i]].shape[0]
        
        if class_num_1_cur == class_num_2_cur and class_num_1_cur != 0:
            f1 = feature_dict1[labeldict[i]]
            f1.sort(axis=0)
            f2 = feature_dict2[labeldict[i]]
            f2.sort(axis=0)
            for _ in range(class_num_1_cur):
                box1_all_points = f1[_] #shape(8, 3)
                box2_all_points = f2[_] #shape(8, 3)
                loss_geo += np.sum((box1_all_points-box2_all_points)**2)
        loss_amount += abs(class_num_1_cur-class_num_2_cur)
    return 10*loss_norm + 10*loss_torch + loss_amount + loss_geo/100000

def write_found_pose_in_sep(folder, filename, frame, pose, rot):
    '''Write the found poses to the xml file
    '''
    torch_dict = {'0': 'MRW510_CDD_10GH', '1': 'TAND_GERAD_DD'}
    
    doc = Document()  # create DOM
    FRAME_DUMP = doc.createElement('FRAME-DUMP') # create root element
    FRAME_DUMP.setAttribute('VERSION', '1.0') 
    FRAME_DUMP.setAttribute('Baugruppe', 'test')
    doc.appendChild(FRAME_DUMP)
    SNaht = doc.createElement('SNaht')
    SNaht.setAttribute('Name',frame[0])
    SNaht.setAttribute('ZRotLock',frame[1])
    SNaht.setAttribute('WkzWkl',frame[2])
    SNaht.setAttribute('WkzName',torch_dict[frame[3]])
    FRAME_DUMP.appendChild(SNaht)

    Kontur = doc.createElement('Kontur')
    SNaht.appendChild(Kontur)

    Punkt = doc.createElement('Punkt')
    Punkt.setAttribute('X', frame[4])
    Punkt.setAttribute('Y', frame[5])
    Punkt.setAttribute('Z', frame[6])
    Kontur.appendChild(Punkt)

    Fl_Norm1 = doc.createElement('Fl_Norm')
    Fl_Norm1.setAttribute('X', frame[7])
    Fl_Norm1.setAttribute('Y', frame[8])
    Fl_Norm1.setAttribute('Z', frame[9])
    Punkt.appendChild(Fl_Norm1)

    Fl_Norm2 = doc.createElement('Fl_Norm')
    Fl_Norm2.setAttribute('X', frame[10])
    Fl_Norm2.setAttribute('Y', frame[11])
    Fl_Norm2.setAttribute('Z', frame[12])
    Punkt.appendChild(Fl_Norm2)
    
    Rot = doc.createElement('Rot')
    Rot.setAttribute('X', frame[13])
    Rot.setAttribute('Y', frame[14])
    Rot.setAttribute('Z', frame[15])
    Punkt.appendChild(Rot)
    EA = doc.createElement('Ext-Achswerte')
    EA.setAttribute('EA3', str(frame[16]))
    Punkt.appendChild(EA)

    Frames = doc.createElement('Frames')
    SNaht.appendChild(Frames)

    Frame = doc.createElement('Frame')
    Frames.appendChild(Frame)

    Pos = doc.createElement('Pos')
    Pos.setAttribute('X', frame[4])
    Pos.setAttribute('Y', frame[5])
    Pos.setAttribute('Z', frame[6])
    Frame.appendChild(Pos)
    
    rot_matrix = linalg.expm(np.cross(np.eye(3), [1,0,0] / linalg.norm([1,0,0]) * (-rot[0])))
    xv = pose[14:17]
    xv_r = np.matmul(rot_matrix, xv.T)
    XVek = doc.createElement('XVek')
    XVek.setAttribute('X', str(xv_r[0]))
    XVek.setAttribute('Y', str(xv_r[1]))
    XVek.setAttribute('Z', str(xv_r[2]))
    Frame.appendChild(XVek)
    yv = pose[17:20]
    yv_r = np.matmul(rot_matrix, yv.T)
    YVek = doc.createElement('YVek')
    YVek.setAttribute('X', str(yv_r[0]))
    YVek.setAttribute('Y', str(yv_r[1]))
    YVek.setAttribute('Z', str(yv_r[2]))
    Frame.appendChild(YVek)
    zv = pose[20:23]
    zv_r = np.matmul(rot_matrix, zv.T)
    ZVek = doc.createElement('ZVek')
    ZVek.setAttribute('X', str(zv_r[0]))
    ZVek.setAttribute('Y', str(zv_r[1]))
    ZVek.setAttribute('Z', str(zv_r[2]))
    Frame.appendChild(ZVek)
    f = open(os.path.join(DATA_PATH, 'test/results/'+folder+'/'+filename+'.xml'),'w')
    f.write(doc.toprettyxml(indent = '  '))
    f.close()




def infer_all_sep(path_test_component=None):
    with open(os.path.join(DATA_PATH, 'train/lookup_table/lookup_table.pkl'), 'rb') as f:
        dict_all = pickle.load(f)
    with open(os.path.join(DATA_PATH, 'ss_lookup_table/norm_fd.pkl'), 'rb') as g:
        norm_fd = pickle.load(g)
    model = Model(MODEL_PATH)
    if not path_test_component == None:
        folders = [os.path.split(path_test_component)[-1]]
    else:
        folders = os.listdir(INPUT_PATH)
    for folder in folders:
        if not os.path.exists(os.path.join(DATA_PATH, 'test/results/'+folder)):
            os.makedirs(os.path.join(DATA_PATH, 'test/results/'+folder))
        else:
            continue
        match_dict = {}
        # get the test slices of a component
        slices_path = os.path.join(INPUT_PATH, folder)
        files = os.listdir(slices_path)
        t = []
        num_t = 0
        for file in files:
            if os.path.splitext(file)[1] == '.xyz':
                start = time.time()
                namestr = os.path.splitext(file)[0]
                print 'Current input file: ', file
                file_path = os.path.join(slices_path, file)
                pc = o3d.io.read_point_cloud(file_path)
                coor_world = o3d.geometry.TriangleMesh.create_coordinate_frame(size=200, origin=np.array([0,0,0]))
                src_xml = os.path.join(INPUT_PATH, folder, namestr+'.xml')
                frames = list2array(parse_frame_dump(src_xml))
                torch = frames[0][3].astype(float)
                normals_1 = frames[0][7:10].astype(float)
                normals_2 = frames[0][10:13].astype(float)

                rot = frames[0][13:16].astype(float)*math.pi/180
                rotation = rotate_mat(axis=[1,0,0], radian=rot[0])
                norm1_r = np.matmul(rotation, normals_1.T)
                norm2_r = np.matmul(rotation, normals_2.T)
                normals_r = norm1_r + norm2_r
                norm_r = np.round(normals_r.astype(float), 2)
                norm_s = ''
                for i in norm_r:
                    if i == 0:
                        norm_s += str(0.0)
                    else:
                        norm_s += str(i)
                xyz = np.asarray(pc.points)
                center = 0.5 * (np.max(xyz,axis=0) + np.min(xyz,axis=0))
                xyz -= center
                xyz *= 0.0025
                xyz_in_expand = np.tile(xyz,(16,1,1))
                l = np.ones(xyz.shape[0])
                l_expand = np.tile(l,(16,1))

                res = model.run_cls(xyz_in_expand, l_expand, False)
                fd1 = get_feature_dict_sep((xyz/0.0025)+center, res[0], normals_r, torch)
                if norm_s in norm_fd.keys():
                    fdicts = norm_fd[norm_s]
                else:
                    norm_rr = np.around(norm_r)
                    # print norm_rr
                    norm_ss = ''
                    for i in norm_rr:
                        if i == 0:
                            norm_ss += str(0.0)
                        else:
                            norm_ss += str(i)
                    if norm_ss in norm_fd.keys():
                        fdicts = norm_fd[norm_ss]
                    else:
                        ran_key = random.sample(norm_fd.keys(), 1)
                        fdicts = norm_fd[ran_key[0]]

                mindiff = 10000
                matched_temp = ''
                matched_fd = {}
                for fdict in fdicts:
                    with open(fdict, 'rb') as tf:
                        fd2 = pickle.load(tf)
                    diff = similarity_sep(fd1, fd2)
                    if diff < mindiff:
                        mindiff = diff
                        matched_temp = os.path.split(fdict)[-1]
                        matched_fd = fd2
                # print 'min_diff: ', mindiff
                print 'matched template: ', matched_temp
                print '----------------------------------------'
                

                matched_name = os.path.splitext(matched_temp)[0]
                write_found_pose_in_sep(folder, namestr, frames[0], dict_all[matched_name],rot)
                match_dict[namestr] = matched_name
                end = time.time()
                t.append(end-start)
        with open(os.path.join(DATA_PATH, 'test/results', folder, 'matched_dict.pkl'), 'wb') as tf:
            pickle.dump(match_dict,tf,protocol=2)
        print 'Average look up time for one test'
        print np.mean(np.array(t))


if __name__=='__main__':
    infer_all_sep(TEST_COMP)
    path = DATA_PATH+'/test/results'
    folders = os.listdir(path)
    for folder in folders:
        files = os.listdir(os.path.join(path, folder))
        xml_list = []
        for file in files:
            if os.path.splitext(file)[1] == '.xml':
                xml_list.append(os.path.join(path, folder, file))
        with open(os.path.join(path, folder, folder +'.xml'), 'w+') as f:
            f.write('<?xml version="1.0" encoding="utf-8" standalone="no" ?>\n')
            f.write('<frame-dump version="1.0" baugruppe="'+folder+'">\n')
            for xml in xml_list:
                g = open(xml, 'r')
                context = g.readlines()
                for line in context[2:-1]:
                    f.write(line)
            f.write('</frame-dump>')
    

       
