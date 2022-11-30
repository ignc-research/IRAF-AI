#Download base image ubuntu 20.04
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

RUN apt-get update && \
    apt-get install -y build-essential libgl-dev  && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


RUN groupadd -r api && useradd -rm -d /home/api -s /bin/bash -g api api

USER api

WORKDIR /home/api


# Copy requirements files
COPY ./api/requirements.txt .
COPY ./api/requirements_py27.txt .

# Install miniconda
ENV CONDA_DIR /home/api/miniconda3
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
     /bin/bash ~/miniconda.sh -b

# Put conda in path so we can use conda activate
ENV PATH=$CONDA_DIR/bin:$PATH

# Set up conda environments
RUN conda create -y -n py3 python=3.9.12
RUN $CONDA_DIR/envs/py3/bin/pip install -r ./requirements.txt

RUN conda create -y -n py27 python=2.7.18
RUN $CONDA_DIR/envs/py27/bin/pip install -r ./requirements_py27.txt
RUN conda install -y -n py27 --channel https://conda.anaconda.org/marta-sd tensorflow-gpu=1.2.0

# Copy application code
COPY --chown=api ./api .

EXPOSE 5002

CMD ["/home/api/miniconda3/envs/py3/bin/python", "app.py"]