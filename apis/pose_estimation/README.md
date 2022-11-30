# Deployment
For a quick setup, ensure that you have a NVIDIA GPU, as well as the [NVIDIA Container Runtime](https://developer.nvidia.com/nvidia-container-runtime) installed.
After that, you are able to build the Dockerfile:
`docker build -t ignc .`
And run it:
`docker run --gpus all -p 5002:5002 ignc`
**Make sure you use the --gpus flag**

# Structure
The Backend is implemented as a Flask project which offers 5 endpoints for the frontend to interact with.
The main goal of the backend is to offer an easily modifyable structure for adding and modifying different prediction models.
In order to achieve this we defined a base_model class which includes functions for predicting and training models as well as the needed parameters for those functions which are called from the frontend.
With this generalisation step it is possible for the frontend to completely generate the UI just based on these definitions.
This has the advantage that models may be added in the future without having to adapt the frontend.

## base_model class (api/models/base_model.py)
Each prediction model is implemented as a class derived from the base_model class.
In order to implement a prediction model the derived class has to implement the following methods:

`def predict_params(self) -> dict:`
This method returns a dictionary of prediction parameters specifically for the implemented model.
For reference see one of the existing models (PointNet++ & Regression)
There are different parameter types like text/number/select/file/multifile which may be extended in the future.
Parameters may also be nested (e.g. Regression)

`def predict(self, params, obj, xml, mtl=None) -> PredictionResult:`
This is the method which is called when a prediction is requested from the frontend.
The parameters contain the values of the predefined predict_params, as well as the obj,xml,mtl file of the welding object for which the prediction is requested.
The return value is a PredictionResult, which includes a name, the complete log, as well as a list of layers.
Each layer has a name and a predicted xml which includes the prediction of every pose inside the input xml. 

`def predict_log(self, params) -> str:`
This method is called periodically from the frontend during a prediction.
As this process may take longer this method offers the user the opportunity to see a live log of the process and estimate the remaining time.
There are different ways to achieve such a live log. In both implemented models we use a helper class, called `Capturing` which redirects all sys.stdout output
to a file, of which the content then can be returned in this log method.
For future implementations you may use a different approach.
**Note however:**  The backend will use different processes for each handled request. Therefore the log method has no trivial access to class instances from the predict request and the log data has to be exchanged somehow. (In our Capture class with the help of a file)


The training methods follow the same pattern, except that the training result just contains the complete log:
`def train(self, params) -> TrainingResult:
    pass
def train_log(self, params) -> str:
    pass
def train_params(self) -> dict:
    pass`


## Implemented models
This is a quick overview of the implemented models and how they are implemented (regarding the base_class adaptation).

### Regression (api/models/regression)
The regression model is included inside the `api/models/regression/model_code` folder with the base_class implementation one level up.
As the model is implemented in python3, we just need to extract the values of the pre-defined prediction&training parameters and call the corresponding training & prediction method of the model code.
For the logs to work, we just encapsulate it with an instance of our `capturing` class which redirects every `print`-call to a log file which then can be re-read.

### PointNet++ (api/models/point_net) [LookupTablePN](https://github.com/chidianlizi/LookupTablePN/tree/pn2)
The PointNet++ model (from the git repo) is included inside the `api/models/point_net/model_code` folder with the base_class implementation one level up.
The PointNet++ was a bit harder to adapt as it uses code from different python versions and uses Anaconda environments for that.
As a workaround for that, we modified the model slightly and directly call the python3 functions whenever possible and in situations where we need python2 functions, we make use of pythons subprocess module.
This allows us, in combination with the (Ana)`conda run` command, to spawn a subprocess which executes the corresponding functions together with their parameters from a different anaconda environment.
The result is then written to a file and read back.
For the log file we again used our `Capturing`-class, but had to manually redirect the stdout output of the subprocess to the parent process.

## Endpoints
### api/Models
This endpoint returns every implemented model (derived from base_model) including their defined prediction and training parameters.
It is called by the frontend on page load or if the parameters may have changed. (e.g. after the training process) 

### api/Prediction (POST)
This endpoint calls the predict() method of the corresponding prediction model.

### api/Prediction/Log (POST)
This endpoint returns the log of a prediction process. It requires the model information including the prediction parameter values, in order for the model class to get the correct log file output.

### api/Training (POST)
This endpoint calls the train() method of the corresponding prediction model.

### api/Training/Log (POST)
This endpoint returns the log of a training process. It requires the model information including the training parameter values, in order for the model class to get the correct log file output.

## Docker
There is a Dockerfile which allows for a quick deployment of our backend.
It builds on top of an NVIDIA-CUDA docker image, in order to support the GPU-dependent PointNet++ model.
The Dockerfile mainly sets up Miniconda3 and creates 2 python environments which are used to call version-dependent functions of prediction models. (e.g. PointNet++)