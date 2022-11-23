import os
import sys
import numpy as np
import datetime
import scipy.io as sio
import h5py
'''
    An example showing how to write .h5 file in python
    Author: Charles QI
    Last updated: Feb 18, 2016
'''

def save_h5(h5_filename, data, label, data_dtype='uint8', label_dtype='uint8'):
    h5_fout = h5py.File(h5_filename, mode='w')
    h5_fout.create_dataset(
            'data', data=data,
            compression='gzip', compression_opts=4,
            dtype=data_dtype,
    )
    h5_fout.create_dataset(
            'label', data=label,
            compression='gzip', compression_opts=1,
            dtype=label_dtype,
    )
    h5_fout.close()

def load_h5(h5_filename):
    f = h5py.File(h5_filename, mode='r')
    # f.keys() should be [u'data', u'label']
    data = f['data'][:]
    label = f['label'][:]
    return (data,label)

