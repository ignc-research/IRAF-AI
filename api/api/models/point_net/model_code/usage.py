import imp
import os
import sys
CURRENT_PATH = os.path.abspath(__file__)
sys.path.insert(0,CURRENT_PATH)
#from lut import LookupTable
from train import TrainPointNet2
#from test import PoseLookup
# in py3 env
# preprocessing for lookup table 
# lut = LookupTable(path_data='./data', label='PDL', hfd_path_classes=None, pcl_density=40, crop_size=400, num_points=2048)
# lut.make()

# change to py2 env
# train pn++
tr = TrainPointNet2(path_data='./data')
# make dataset
tr.make_dataset(crop_size=400, num_points=2048)
# training
tr.train(log_dir='./data/seg_model', gpu=0, num_point=2048, max_epoch=100, batch_size=16, learning_rate=0.001)

# # change to py3 env
# # test preprocessing
# te = PoseLookup(path_data='./data')
# te.preprocessing(path_test_component='./data/test/models/201910292399', pcl_density=40, crop_size=400, num_points=2048)

# # change to py2 env
# te = PoseLookup(path_data='./data')
# te.inference(model_path='./data/seg_model/model1.ckpt', test_input='./data/test/welding_zone_test', test_one_component='./data/test/models/201910292399')