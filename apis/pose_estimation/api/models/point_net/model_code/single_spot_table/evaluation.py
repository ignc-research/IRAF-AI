#################################################################
# The matching results are compared with the true values to     #
# generate evaluation results and comparison images.            #
#################################################################
import os
import open3d as o3d
import numpy as np
import matplotlib.pyplot as plt
from xml.dom.minidom import Document
from copy import copy
import pickle
import sys
import math
import scipy.linalg as linalg

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE_DIR)
sys.path.append(os.path.join(ROOT,'utils'))
from xml_parser import parse_frame_dump, list2array
from foundation import points2pcd, load_pcd_data
from math_util import rotate_mat



def pose_error(pose1, pose2):
    """pose1, pose2 are (1, 3) shape arrays, zvek for each pose"""
    l_x = np.sqrt(pose1.dot(pose1))
    l_y = np.sqrt(pose2.dot(pose2))

    dot = pose1.dot(pose2)
    cos_ = dot / (l_x*l_y)
    angle = np.arccos(cos_)
    error = angle / np.pi
    return error

def get_slice_name(path, info):
    xmls = os.listdir(path)
    name_comp = os.path.split(path)[-1]
    for xml in xmls:
        if os.path.splitext(xml)[1] == '.xml' and not xml == name_comp+'.xml':
            pn = list2array(parse_frame_dump(os.path.join(path, xml)))[0][3:13].astype(float)
            pn = np.around(pn, 6)
            if (info == pn).all():
                return os.path.splitext(xml)[0]

def visualizer(fig_path, pcd, torch, pose):
    '''
    pcd: o3d.geometry.PointCloud()
    pose: 4x4 ndarray
    '''
    vis = o3d.visualization.Visualizer()

    vis.create_window(visible=True) 
    vis.add_geometry(pcd)
    vis.update_geometry(pcd)
    rot = pose[0:3].astype(float)*math.pi/180
    rotation = rotate_mat(axis=[1,0,0], radian=rot[0])
    pos = np.zeros((3,3))
    pos[0:3, 0] = pose[4:7]
    pos[0:3, 1] = pose[7:10]
    pos[0:3, 2] = pose[10:23]
    pose_new = np.matmul(rotation, pos)
    tf = np.zeros((4,4))
    tf[0:3,0:3] = pose_new
    tf[3,3] = 1.0
    torch.compute_vertex_normals()
    torch.transform(tf)
    origin_frame = o3d.geometry.TriangleMesh.create_coordinate_frame(size=300, origin=[0, 0, 0])
    
    vis.add_geometry(origin_frame)
    vis.update_geometry(origin_frame)
    # o3d.visualization.draw_geometries([torch, pcd, origin_frame], fig_path)
    vis.add_geometry(torch)
    vis.update_geometry(torch)
    vis.poll_events()
    vis.update_renderer()
    vis.capture_screen_image(fig_path)
    vis.destroy_window()


def visualizer_3(fig_path, pcd, torch, pose):
    '''
    pcd: o3d.geometry.PointCloud()
    pose: 4x4 ndarray
    '''
    vis = o3d.visualization.Visualizer()

    vis.create_window(visible=True) 
    vis.add_geometry(pcd)
    vis.update_geometry(pcd)
    rot = pose[0:3].astype(float)*math.pi/180
    rotation = rotate_mat(axis=[1,0,0], radian=rot[0])

    tf = np.zeros((4,4))
    tf[3,3] = 1.0
    tf[0:3, 0] = pose[4:7]
    tf[0:3, 1] = pose[7:10]
    tf[0:3, 2] = pose[10:23]
    torch.compute_vertex_normals()
    torch.transform(tf)
    origin_frame = o3d.geometry.TriangleMesh.create_coordinate_frame(size=300, origin=[0, 0, 0])
    
    vis.add_geometry(origin_frame)
    vis.update_geometry(origin_frame)
    # o3d.visualization.draw_geometries([torch, pcd, origin_frame], fig_path)
    vis.add_geometry(torch)
    vis.update_geometry(torch)
    vis.poll_events()
    vis.update_renderer()
    vis.capture_screen_image(fig_path)
    vis.destroy_window()

def show_error():
    # load lookup table
    with open('../data/train/lookup_table/lookup_table.pkl', 'rb') as f:
        dict_all = pickle.load(f)

    path_torch_1 = '../data/torch/MRW510_10GH.obj'
    path_torch_2 = '../data/torch/TAND_GERAD_DD.obj'
    path_result = '../data/test/results'
    folders = os.listdir(path_result)

    for folder in folders:
        print ('current component:', folder)
        with open(os.path.join(path_result, folder,'matched_dict.pkl'), 'rb') as f:
            matched_dict = pickle.load(f)

        path_model = '../data/test/models/'+folder+'/'+folder+'.obj'
        mesh_model = o3d.io.read_triangle_mesh(path_model)
        mesh_model.compute_vertex_normals()
        elements = []
        elements.append(mesh_model)


        torch1 = o3d.io.read_triangle_mesh(path_torch_1)
        torch2 = o3d.io.read_triangle_mesh(path_torch_2)
        # predicted xml file 
        res = path_result+'/'+folder+'/'+folder+'.xml'
        # ground truth of xml file
        templ = '../data/test/models/'+folder+'/'+folder+'.xml'
        # predicted result
        r = list2array(parse_frame_dump(res))[:,3:].astype(float)
        # ground truth
        t = list2array(parse_frame_dump(templ))[:,3:].astype(float)
        r = np.around(r, 6)
        t = np.around(t, 6)
        collided_num = 0
        num_total = 0
        num_correct = 0
        num_error = 0
        # set color for visualization, green for corret, red for collision, blue for safe
        green = np.array([0,1,0])
        red = np.array([1,0,0])
        blue = np.array([0,0,1])

        for ii in range(r.shape[0]):
            num_total += 1
            tf = np.zeros((4,4))
            tf[3,3] = 1.0          
            tf[0:3, 3] = r[ii,1:4]
            tf[0:3, 0] = r[ii,14:17]
            tf[0:3, 1] = r[ii,17:20]
            tf[0:3, 2] = r[ii,20:23]
            for jj in range(t.shape[0]):
                if (r[ii,0:10] == t[jj,0:10]).all():
                    if (r[ii,14:23] == t[jj,14:23]).all():
                        num_correct += 1
                        print ('No. '+str(ii)+': totally correct')
                        slice_name = get_slice_name(path_result+'/'+folder, r[ii, 0:10])
                        matched_temp = matched_dict[slice_name]
                        path_slice_xyz = '../data/test/welding_zone_test/'+folder+'/'+slice_name+'.xyz'
                        path_slice_matched = '../data/train/welding_zone_comp/'+matched_dict[slice_name]+'.pcd'
                        pose_matched = dict_all[matched_temp]

                        slice_pc = o3d.io.read_point_cloud(path_slice_xyz)
                        matched_pc = o3d.io.read_point_cloud(path_slice_matched)
                        figs_path = path_result+'/'+folder+'/figs/correct'
                        if not os.path.exists(figs_path):
                            os.makedirs(figs_path)
                        fig_path1 = os.path.join(figs_path, slice_name+'_prediction.png')
                        fig_path2 = os.path.join(figs_path, slice_name+'_gt.png')
                        fig_path3 = os.path.join(figs_path, slice_name+'_templetewithitsgt_'+matched_temp+'.png')
                        visualizer(fig_path1, slice_pc, o3d.io.read_triangle_mesh(path_torch), r[ii][-13:])
                        visualizer(fig_path2, slice_pc, o3d.io.read_triangle_mesh(path_torch), t[jj][-13:])
                        if pose_matched[0] == 0:
                            path_torch_temp = path_torch_1
                        else:
                            path_torch_temp = path_torch_2
                        visualizer_3(fig_path3, matched_pc, o3d.io.read_triangle_mesh(path_torch_temp), pose_matched[-13:])
                        if (r[ii,0]==0):
                            mesh_torch = copy(torch1)
                        else:
                            mesh_torch = copy(torch2)
                            mesh_torch.compute_vertex_normals()
                            mesh_torch.paint_uniform_color(green)
                            mesh_torch.transform(tf)
                            elements.append(mesh_torch)
                    else:
                        pose_e_z = pose_error(r[ii,20:23], t[jj,20:23])
                        pose_e_x = pose_error(r[ii,14:17], t[jj,14:17])
                        if pose_e_z<0.035 and pose_e_x<0.035:
                            num_correct += 1
                            print ('No. '+str(ii)+': correct')
                            slice_name = get_slice_name(path_result+'/'+folder, r[ii, 0:10])
                            matched_temp = matched_dict[slice_name]
                            path_slice_xyz = '../data/test/welding_zone_test/'+folder+'/'+slice_name+'.xyz'
                            path_slice_matched = '../data/train/welding_zone_comp/'+matched_dict[slice_name]+'.pcd'
                            pose_matched = dict_all[matched_temp]
                            slice_pc = o3d.io.read_point_cloud(path_slice_xyz)
                            matched_pc = o3d.io.read_point_cloud(path_slice_matched)
                            figs_path = path_result+'/'+folder+'/figs/correct'
                            if not os.path.exists(figs_path):
                                os.makedirs(figs_path)
                            fig_path1 = os.path.join(figs_path, slice_name+'_prediction.png')
                            fig_path2 = os.path.join(figs_path, slice_name+'_gt.png')
                            fig_path3 = os.path.join(figs_path, slice_name+'_templetewithitsgt_'+matched_temp+'.png')
                            visualizer(fig_path1, slice_pc, o3d.io.read_triangle_mesh(path_torch), r[ii][-13:])
                            visualizer(fig_path2, slice_pc, o3d.io.read_triangle_mesh(path_torch), t[jj][-13:])
                            visualizer_3(fig_path3, matched_pc, o3d.io.read_triangle_mesh(path_torch_temp), pose_matched[-13:])

                            if (r[ii,0]==0):
                                mesh_torch = copy(torch1)
                            else:
                                mesh_torch = copy(torch2)

                            mesh_torch.compute_vertex_normals()
                            mesh_torch.paint_uniform_color(green)
                            mesh_torch.transform(tf)
                            elements.append(mesh_torch)
                        else:
                            num_error += 1
                            if r[ii, 0] == 0:
                                path_torch = path_torch_1
                            else:
                                path_torch = path_torch_2
                            mesh_torch = o3d.io.read_triangle_mesh(path_torch)
                            mesh_torch.compute_vertex_normals()
                            mesh_torch.transform(tf)
                            if mesh_torch.is_intersecting(mesh_model):
                                collided_num += 1
                                print ('No. '+str(ii)+': collided')
                                slice_name = get_slice_name(path_result+'/'+folder, r[ii, 0:10])
                                matched_temp = matched_dict[slice_name]
                                path_slice_xyz = '../data/test/welding_zone_test/'+folder+'/'+slice_name+'.xyz'
                                path_slice_matched = '../data/train/welding_zone_comp/'+matched_dict[slice_name]+'.pcd'
                                pose_matched = dict_all[matched_temp]
                                slice_pc = o3d.io.read_point_cloud(path_slice_xyz)
                                matched_pc = o3d.io.read_point_cloud(path_slice_matched)
                                figs_path = path_result+'/'+folder+'/figs/collided'
                                if not os.path.exists(figs_path):
                                    os.makedirs(figs_path)
                                fig_path1 = os.path.join(figs_path, slice_name+'_prediction.png')
                                fig_path2 = os.path.join(figs_path, slice_name+'_gt.png')
                                fig_path3 = os.path.join(figs_path, slice_name+'_templetewithitsgt_'+matched_temp+'.png')
                                visualizer(fig_path1, slice_pc, o3d.io.read_triangle_mesh(path_torch), r[ii][-13:])
                                visualizer(fig_path2, slice_pc, o3d.io.read_triangle_mesh(path_torch), t[jj][-13:])
                                if pose_matched[0] == 0:
                                    path_torch_temp = path_torch_1
                                else:
                                    path_torch_temp = path_torch_2
                                visualizer_3(fig_path3, matched_pc, o3d.io.read_triangle_mesh(path_torch_temp), pose_matched[-13:])
                                mesh_torch.paint_uniform_color(red)
                                elements.append(mesh_torch)


                                # o3d.visualization.draw_geometries([mesh_model, mesh_torch])
                            else:
                                print ('No. '+str(ii)+': safe')
                                slice_name = get_slice_name(path_result+'/'+folder, r[ii, 0:10])
                                matched_temp = matched_dict[slice_name]
                                path_slice_xyz = '../data/test/welding_zone_test/'+folder+'/'+slice_name+'.xyz'
                                path_slice_matched = '../data/train/welding_zone_comp/'+matched_dict[slice_name]+'.pcd'
                                pose_matched = dict_all[matched_temp]
                                slice_pc = o3d.io.read_point_cloud(path_slice_xyz)
                                matched_pc = o3d.io.read_point_cloud(path_slice_matched)
                                figs_path = path_result+'/'+folder+'/figs/safe'
                                if not os.path.exists(figs_path):
                                    os.makedirs(figs_path)
                                fig_path1 = os.path.join(figs_path, slice_name+'_prediction.png')
                                fig_path2 = os.path.join(figs_path, slice_name+'_gt.png')
                                fig_path3 = os.path.join(figs_path, slice_name+'_templetewithitsgt_'+matched_temp+'.png')
                                visualizer(fig_path1, slice_pc, o3d.io.read_triangle_mesh(path_torch), r[ii][-13:])
                                visualizer(fig_path2, slice_pc, o3d.io.read_triangle_mesh(path_torch), t[jj][-13:])
                                if pose_matched[0] == 0:
                                    path_torch_temp = path_torch_1
                                else:
                                    path_torch_temp = path_torch_2
                                visualizer_3(fig_path3, matched_pc, o3d.io.read_triangle_mesh(path_torch_temp), pose_matched[-13:])
                                mesh_torch.paint_uniform_color(blue)
                                elements.append(mesh_torch)

                    break

        o3d.visualization.draw_geometries(elements, window_name=folder)

        with open(os.path.join(path_result, folder, 'eval.txt'), 'w+') as evaltxt:
            evaltxt.write('total: '+str(num_total)+'\n')
            evaltxt.write('correct: '+str(num_correct)+'\n')
            evaltxt.write('incorrect but no collision: '+str(num_total-num_correct-collided_num)+'\n')
            evaltxt.write('collision: '+str(collided_num))

        print (num_total, num_correct, num_total-num_correct-collided_num, collided_num)


if __name__=='__main__':
    show_error()



        



