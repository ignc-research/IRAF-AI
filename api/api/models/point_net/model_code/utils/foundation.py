import os
import sys
import numpy as np
import h5py
import open3d as o3d
import random
import copy
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def obj2pcd(path_obj, path_pcd):
    if not os.path.exists(path_pcd):
        os.makedirs(path_pcd)

    for home, dirs, files in os.walk(path_obj):
        for filename in files:
            # Filelist.append(os.path.join(home, filename))
            if os.path.splitext(filename)[1] == '.obj':
                # os.system('cp %s %s'%(os.path.join(home, filename), path_pcd))
                mesh = o3d.io.read_triangle_mesh(os.path.join(home, filename)) # load .obj mesh
                number_points = int(mesh.get_surface_area()/100) # get number of points according to surface area
                print (number_points)
                pc = mesh.sample_points_poisson_disk(number_points, init_factor=5) # poisson disk sampling
                print (np.asarray(pc.points).shape)
                o3d.io.write_point_cloud(os.path.join(path_pcd, os.path.splitext(filename)[0]+'.pcd'), pc, write_ascii=True)

def xyz2pcd(path_xyz, path_pcd):
    pcd = o3d.io.read_point_cloud(path_xyz)
    o3d.io.write_point_cloud(os.path.join(path_pcd,os.path.splitext(os.path.split(path_xyz)[1])[0]+'.pcd'), pcd, write_ascii=True)

def points2pcd(path, points):
    """
    path: ***/***/1.pcd
    points: ndarray, xyz+lable
    """
    handle = open(path, 'w')
    point_num=points.shape[0]
    handle.write('VERSION .7\nFIELDS x y z label object\nSIZE 4 4 4 4 4\nTYPE F F F I I\nCOUNT 1 1 1 1 1')
    string = '\nWIDTH '+str(point_num)
    handle.write(string)
    handle.write('\nHEIGHT 1')
    string = '\nPOINTS '+str(point_num)
    handle.write(string)
    handle.write('\nVIEWPOINT 0 0 0 1 0 0 0')
    handle.write('\nDATA ascii')
    obj = -1 * np.ones((point_num,1))
    points_f = np.c_[points, obj]
    for i in range(point_num):
        handle.write('\n'+str(points_f[i, 0])+' '+str(points_f[i, 1])+' '+
                str(points_f[i, 2])+' '+str(int(points_f[i, 3]))+' '+str(int(points_f[i,4])))
    handle.close()

def load_pcd_data(file_path):
    '''
    file_path: path to .pcd file, i.e., './data/abc.pcd'
    return:
        res: np.array with shape (n,4)
    '''
    pts = []
    f = open(file_path, 'r')
    data = f.readlines()
    f.close()
    for line in data[10:]:
        line = line.strip('\n')
        xyzlable = line.split(' ')
        x, y, z, lable = [eval(i) for i in xyzlable[:4]]
        pts.append([x,y,z,lable])
    res = np.zeros((len(pts),len(pts[0])), dtype = np.float64)
    for i in range(len(pts)):
        res[i] = pts[i]
    return res

def draw(xyz, label):
    """
    display point clouds with label
    xyz: Nx3
    label: N
    """
    fig = plt.figure()
    # ax = Axes3D(fig,auto_add_to_figure=False)
    ax = Axes3D(fig)
    fig.add_axes(ax)
    ax.scatter(xyz[:,0],xyz[:,1],xyz[:,2],c=label)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_zlabel("z")
    max_edge = np.max(np.max(xyz, axis=0)-np.min(xyz, axis=0))

    ax.set_xlim(-0.5*max_edge, 0.5*max_edge)
    ax.set_ylim(-0.5*max_edge, 0.5*max_edge)
    ax.set_zlim(-0.5*max_edge, 0.5*max_edge)
    plt.show()

def show_obj(path):
    files = os.listdir(path)
    geometries = []
    for file in files:
        if os.path.splitext(file)[1] == '.obj':
            mesh = o3d.io.read_triangle_mesh(os.path.join(path, file))
            mesh.compute_vertex_normals()
            geometries.append(mesh)
    o3d.visualization.draw_geometries(geometries, path)

def fps(points, n_samples):
    """
    points: [N, >=3] array containing the whole point cloud
    n_samples: samples you want in the sampled point cloud typically << N
    """
    points = np.array(points)
    # Represent the points by their indices in points
    points_left = np.arange(len(points)) # [P]
    # Initialise an array for the sampled indices
    sample_inds = np.zeros(n_samples, dtype='int') # [S]
    # Initialise distances to inf
    dists = np.ones_like(points_left) * float('inf') # [P]

    selected = 0
    sample_inds[0] = points_left[selected]
    points_left = np.delete(points_left, selected) # [P - 1]

    # Iteratively select points for a maximum of n_samples
    for i in range(1, n_samples):
        # Find the distance to the last added point in selected
        # and all the others
        last_added = sample_inds[i-1]
        dist_to_last_added_point = (
                (points[last_added, 0:3] - points[points_left, 0:3])**2).sum(-1) # [P - i]

        dists[points_left] = np.minimum(dist_to_last_added_point,
                                        dists[points_left]) # [P - i]

        # distance to the sampled points
        selected = np.argmax(dists[points_left])
        sample_inds[i] = points_left[selected]

        # Update points_left
        points_left = np.delete(points_left, selected)

    return points[sample_inds]

