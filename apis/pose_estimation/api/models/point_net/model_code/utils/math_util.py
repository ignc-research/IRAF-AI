import numpy as np
import scipy.linalg as linalg

def calc_triangle_area(x1, y1, x2, y2, x3, y3):
        return 0.5 * abs(x2*y3+x1*y2+x3*y1-3*y2-x2*y1-x1*y3)
    
def get_projections_of_triangle(p1, p2, p3):
    (x1, y1, z1) =  p1
    (x2, y2, z2) =  p2
    (x3, y3, z3) =  p3
    proj_xoy = calc_triangle_area(x1, y1, x2, y2, x3, y3)
    proj_yoz = calc_triangle_area(y1, z1, y2, z2, y3, z3)
    proj_xoz = calc_triangle_area(x1, z1, x2, z2, x3, z3)
    return proj_xoy, proj_yoz, proj_xoz
    
def get_angle(vector_1, vector_2):
    unit_vector_1 = vector_1 / np.linalg.norm(vector_1)
    unit_vector_2 = vector_2 / np.linalg.norm(vector_2)
    angle=np.arccos(np.dot(vector_1,vector_2)/(np.linalg.norm(vector_1)*np.linalg.norm(vector_2)))
    angle_deg = np.rad2deg(angle)
    return angle, angle_deg

def rotate_mat(axis, radian):
    '''
    axis_x, axis_y, axis_z = [1,0,0], [0,1,0], [0, 0, 1]
    '''
    rot_matrix = linalg.expm(np.cross(np.eye(3), axis / linalg.norm(axis) * radian))
    return rot_matrix

def rotation_matrix_from_vectors(vec1, vec2):
    """ Find the rotation matrix that aligns vec1 to vec2
    :param vec1: A 3d "source" vector
    :param vec2: A 3d "destination" vector
    :return mat: A transform matrix (3x3) which when applied to vec1, aligns it with vec2.
    """
    a, b = (vec1 / np.linalg.norm(vec1)).reshape(3), (vec2 / np.linalg.norm(vec2)).reshape(3)
    # print (a, b)
    v = np.cross(a, b)
    c = np.dot(a, b)
    s = np.linalg.norm(v)
    if s==0:
        return np.eye(3)
    else:
        kmat = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
        rotation_matrix = np.eye(3) + kmat + kmat.dot(kmat) * ((1 - c) / (s ** 2))
        return rotation_matrix