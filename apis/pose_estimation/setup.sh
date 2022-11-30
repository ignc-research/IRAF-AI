#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Not running as root"
    exit
fi

eval "$(conda shell.bash hook)"
conda create -y -n py3 python=3.9.12
conda activate py3
pip install -r ./api/requirements.txt
conda deactivate

conda create -y -n py27 python=2.7.18
conda activate py27
pip install -r ./api/requirements_py27.txt
conda install -y -n py27 --channel https://conda.anaconda.org/marta-sd tensorflow-gpu=1.2.0
conda deactivate