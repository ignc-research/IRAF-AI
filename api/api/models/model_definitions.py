from .mesh_cnn.mesh_cnn import MeshCNN
from .point_net.point_net import PointNet
from .laser_map.laser_map import LaserMap
from .base_model import BaseModel
from .regression.regression_model import RegressionModel

models = [RegressionModel(), LaserMap(), PointNet(), MeshCNN()]