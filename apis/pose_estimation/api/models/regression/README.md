# Regression- and Norm-based Predicitons for Robotic Torch Positions

## Folder structure and short file descriptions

    model_code
    ├── data
    │   ├── database                    # used for norm-based predictions
    ├── data_processing
    │   ├── create_laser_beam_csvs.py   # creates .csv laser beam files containing laser hit_points/fractions and other datapoints used for ML training
    │   │                               # and ML- and norm-based predictions
    │   ├── create_urdf.py              # creates .urdf files needed for pybullet execution in create_laser_beam_csvs.py
    │   ├── transform_to_model_input    # transforms laser beam file into training/prediction input for ML model
    │   └── unit_conversion_obj.py      # converts units in .obj files, necessary for pybullet
    ├── prediction
    │   ├── convolutional_base_model    # pretrained convolutional regression model
    │   ├── fully_connected_base_model  # pretrained fully connected regression model
    │   └── non_ml.py                   # norm-based predictions
    ├── training
    │   ├── base_model.py               # convolutional and fully connected model with fixed architecture
    │   └── custom_model.py.py          # dynamic convulutional and fully connected model, architecture can be defined by user
    └── app.py                          # training and prediction pipelines used by the frontend

## Pipelines

The following two pipelines can be triggered in the web application. Please refer to the README.md in /industrial-web-application/fe and industrial-web-application/api for more details. 


<img width="1228" alt="image" src="https://user-images.githubusercontent.com/37510611/197345339-dba0da22-e45d-410b-b045-98ea61a6fae3.png">



<img width="1228" alt="image" src="https://user-images.githubusercontent.com/37510611/197239022-6d4cb361-78b2-4ea6-8b17-6a56dec8d5b6.png">

## Create database for norm-based predictions

This functionality can not yet be triggered from the web application.
To create a new database for the norm based predictions from a new set of files, you first need to perform certain data processing steps.

<img width="467" alt="image" src="https://user-images.githubusercontent.com/37510611/197362481-a6ad6cd9-0609-4f54-a06d-baf71b4b48f1.png">


Prerequisites: One folder named "data" containing two sub folders: "objects_xmls" containing the .xml files and "objects_objs" containing the .obj files of the object(s).

Navigate to the "data_processing" folder.

1. Execute `python unit_conversion_obj.py`
2. Execute `python create_urdf.py`
3. <br/> a. (optional) Adapt the parameters num_ray, sensor_loc_factor in the main function of create_laser_beam_csvs.py <br/>
b. Execute `python create_laser_beam_csvs.py`

If you would like to use this database in the prediction pipeline for norm-based predictions you need to change `objects_beam_files_path: str = "./data/database"` to `objects_beam_files_path: str = "./data/new_database"` in `def predict_via_norm` in prediction/non_ml.py

## Test norm-based predictions

Navigate to the "prediction" folder.
If you would like to test the norm based prediction (e.g. because you added a new norm), you can execute `python non_ml.py`.

You can 

1. Test a norm for a single point and get a file with all prediction scores created by the function <br/>
a. uncomment lines 83-88 and 118-123 <br/>
b. define the norm you would like to test by changing the "norm" parameter in line 121 <br/>
2. Test a norm for all points of an object and get an .xml file including all predicted poses <br/>
a. uncomment lines 127-169 <br/>
b. define the norm you would like to test by changing the "norm" parameter in line 149 




