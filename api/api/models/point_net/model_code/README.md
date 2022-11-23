# LookupTablePN
## Environment Configuration
An available docker can be found [here](https://hub.docker.com/repository/docker/chidianlizi/pointnet) with anaconda virtual environments named py37 and py27 already configured, where py37 is the python3 environment and py27 is the python2 environment. If you want to configure your environment locally, we also recommend using [Anaconda3](https://www.anaconda.com). After installing Anaconda, do the following steps one by one.


```bash
conda create -n py3 python=3.9.12
conda activate py3
pip install -r requirements.txt
conda deactivate py3
conda create -n py27 python=2.7.18
conda activate py27
conda install --channel https://conda.anaconda.org/marta-sd tensorflow-gpu=1.2.0
pip install -r requirements_py27.txt
conda deactivate py27
```



## Usage
Before starting, please place the files in the following directory format:
```
LookupTablePN
├── data
│   ├── train
│   │   ├── models
│   │   │   ├── componentname1
│   │   │   │   ├── componentname1.obj
│   │   │   │   ├── componentname1.mtl
│   │   │   │   ├── componentname1.xml
│   │   │   ├── componentname2
│   │   │   │   ├── componentname2.obj
│   │   │   │   ├── componentname2.mtl
│   │   │   │   ├── componentname2.xml
│   │   │   ├── ...
│   ├── torch
│   │   ├── MRW510_10GH.obj
│   │   ├── TAND_GERAD_DD.obj
│   ├── test
│   │   ├── models
│   │   │   ├── componentname1
│   │   │   │   ├── componentname1.obj
│   │   │   │   ├── componentname1.mtl
│   │   │   │   ├── componentname1.xml
│   │   │   ├── componentname2
│   │   │   │   ├── componentname2.obj
│   │   │   │   ├── componentname2.mtl
│   │   │   │   ├── componentname2.xml
│   │   │   ├── ...
```
### Training Step 1. Data Pre-processing & Making lookup Table
In Python3 environment
```python
lut = LookupTable(path_data='./data', label='PDL', hfd_path_classes=None, pcl_density=40, crop_size=400, num_points=2048)
lut.make()

```
> class lut.LookupTable(path_data, label, hfd_path_classes, pcl_density=40, crop_size=400, num_points=2048)
- path_data: The path to the data folder, see readme for the specific directory structure
- label: Labeling methods, there are 'PDL' and 'HFD'. PDL is pre-defined lable, if the color (material) of the parts of assemblies in the CAD design is differentiated according to the different kinds of parts, use PDL. HFD uses hybrid feature descriptors to cluster the parts of the assemblies, use it by running obj_geo_based_classification.py to generate the classification first, then enter the classification directory in arg hfd_path_classes
- hfd_path_classes: Path to the classification result by HFD method. The default folder is "./data/train/parts_classification"
- pcl_density: A parameter that controls the density of the point cloud, the smaller the value the higher the density
- crop_size: Edge lengths of point cloud slices in millimeters
- num_points: Number of points contained in the point cloud slice 

### Training Step 2. Train PN++
In Python2 environment
```python
tr = TrainPointNet2(path_data='./data')
# make dataset
tr.make_dataset(crop_size=400, num_points=2048)
# training
tr.train(log_dir='./data/seg_model', gpu=0, num_point=2048, max_epoch=100, batch_size=16, learning_rate=0.001)

```
> class train.TrainPointNet2(path_data)
- path_data: The path to the data folder, see readme for the specific directory structure

> make_dataset(crop_size=400, num_points=2048)
- crop_size: Edge lengths of point cloud slices in millimeters. Must be consistent with the values used in the previous lookup table creation [default: 400]
- num_points: Number of points contained in the point cloud slice  [default: 2048]

> train(log_dir, gpu=0, num_point=2048, max_epoch=100, batch_size=16, learning_rate=0.001)
- log_dir: path to the pn++ model
- gpu: GPU to use [default: 0]
- num_point: Point Number [default: 2048]
- max_epoch: Epoch to run [default: 100]
- batch_size: Batch Size during training [default: 16]
- learning_rate: Initial learning rate [default: 0.001]

### Testing Step 1. Data Pre-processing
In Python3 environment
```python
te = PoseLookup(path_data='./data')
te.preprocessing(path_test_component='./data/test/models/201910292399', pcl_density=40, crop_size=400, num_points=2048)

```
> class test.PoseLookup(path_data)
- path_data: The path to the data folder, see readme for the specific directory structure

> preprocessing(path_test_component, pcl_density=40, crop_size=400, num_points=2048)
- path_test_component: path to the test component
- pcl_density: A parameter that controls the density of the point cloud, the smaller the value the higher the density
- crop_size: Edge lengths of point cloud slices in millimeters. Must be consistent with the values used in the previous lookup table creation [default: 400]
- num_points: Number of points contained in the point cloud slice  [default: 2048]

### Testing Step 2. Inference

In Python2 environment
```python
te = PoseLookup(path_data='./data')
te.inference(model_path='./data/seg_model/model1.ckpt', test_input='./data/test/welding_zone_test', test_one_component='./data/test/models/201910292399')
```
> inference(model_path, test_input, test_one_component)
- model_path: path to the pn++ model [default: './data/seg_model/model1.ckpt']
- test_input: path to the folder of welding slices for testing [default: './data/test/welding_zone_test']
- test_one_component: if only one component will be tested, enter the path here [default: None]