import tensorflow as tf
import numpy as np

from tensorflow import keras
from keras import layers
import pandas as pd

import matplotlib.pyplot as plt

import os

# Make NumPy printouts easier to read.
np.set_printoptions(precision=3, suppress=True)


def plot_loss(history):
    plt.plot(history.history["loss"], label="loss")
    plt.plot(history.history["val_loss"], label="val_loss")
    plt.ylim([0, 10])
    plt.xlabel("Epoch")
    plt.ylabel("Error [MPG]")
    plt.legend()
    plt.grid(True)
    plt.show()


def to_np_array(vector_str):
    np_vector = np.array(vector_str.split())
    np_vector = np_vector.astype(np.float32)
    return np_vector


def sample_dataset(dataset, sample_size):
    dataset = dataset.iloc[:: int(len(dataset) / (sample_size)), :]

    return dataset


def data_processing(path, sample, sample_size):
    raw_dataset = pd.read_csv(
        path, na_values="?", comment="\t", sep=";", skipinitialspace=True
    )
    dataset = raw_dataset.copy()

    if sample:
        dataset = sample_dataset(dataset, sample_size)
        dataset_length = sample_size
    else:
        dataset_length = len(dataset)

    vector_cols = (
        "Frame_Xvek",
        "Frame_Yvek",
        "Frame_Zvek",
        "hit_nor_pos",
    )
    df_with_arrays = dataset.copy(deep=True)

    for col in vector_cols:
        df_with_arrays[col] = df_with_arrays[col].apply(to_np_array)

    point_data = df_with_arrays.copy(deep=True).iloc[1, :]
    point_data["hit_nor_pos"] = df_with_arrays["hit_nor_pos"].to_numpy()

    point_data = point_data.to_frame().T
    return point_data, dataset_length


def create_train_test_split(data):
    train_dataset = data.sample(frac=0.8, random_state=0)
    test_dataset = data.drop(train_dataset.index)

    y_train = pd.concat(
        [train_dataset.pop(col) for col in ["Frame_Xvek", "Frame_Yvek", "Frame_Zvek"]],
        axis=1,
    )
    X_train = pd.concat([train_dataset.pop(col) for col in ["hit_nor_pos"]], axis=1)

    y_test = pd.concat(
        [test_dataset.pop(col) for col in ["Frame_Xvek", "Frame_Yvek", "Frame_Zvek"]],
        axis=1,
    )
    X_test = pd.concat([test_dataset.pop(col) for col in ["hit_nor_pos"]], axis=1)

    y_train = np.array([np.vstack(arr) for arr in np.array(y_train)])
    X_train = np.array([np.vstack(arr[0]) for arr in np.array(X_train)])
    y_test = np.array([np.vstack(arr) for arr in np.array(y_test)])
    X_test = np.array([np.vstack(arr[0]) for arr in np.array(X_test)])

    return X_train, y_train, X_test, y_test


def build_and_compile_fully_connected_model():

    inputs = keras.Input(shape=(dataset_length, 3))
    x = tf.keras.layers.UpSampling1D(3)(inputs)  

    x = layers.Dense(32, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)

    x = tf.keras.layers.MaxPooling1D(dataset_length)(x)  

    outputs = layers.Dense(3)(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="model")
        
    model.compile(loss='mean_absolute_error',
                    optimizer=tf.keras.optimizers.Adam(0.001),
                    metrics=['accuracy'])

    return model

def build_and_compile_convolutional_model():
    
    inputs = keras.Input(shape=(dataset_length, 3))

    x = tf.keras.layers.UpSampling1D(3)(inputs)

    x = layers.Conv1D(32, 1, activation="tanh")(x)
    x = layers.Conv1D(32, 1, activation="tanh")(x)
    
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)
    x = layers.Dense(64, activation="tanh")(x)

    x = tf.keras.layers.MaxPooling1D(dataset_length)(x)  
    
    outputs = layers.Dense(3)(x)


    model = keras.Model(inputs=inputs, outputs=outputs, name="model")

    model.compile(loss='mean_absolute_error',
                    optimizer=tf.keras.optimizers.Adam(0.001),
                    metrics=['accuracy'])
    
    return model 


if __name__ == "__main__":

    sample = False
    sample_size = 20

    model_type = "convolutional"

    path = "/Users/nike/ignc/industrial-web-application/ml/data/objects_beam_new_sensor_ml"
    dir = os.listdir(path)
    data = pd.DataFrame(
        columns=[
            "Frame_Xvek",
            "Frame_Yvek",
            "Frame_Zvek",
            "hit_nor_pos",
        ]
    )
    for file in dir:
        point_data, dataset_length = data_processing(
            "{}/{}".format(path, file), sample, sample_size
        )
        point_data["csv_name"] = file
        data = pd.concat([data, point_data], ignore_index=True)

    # print(model.summary())

    X_train, y_train, X_test, y_test = create_train_test_split(data=data)

    if model_type == "fully_connected":

        model = build_and_compile_fully_connected_model()

        history = model.fit(
            X_train,
            y_train,
            validation_split=0.2,
            epochs=200,
            validation_data=(X_test, y_test),
        )

    elif model_type == "convolutional":

        model = build_and_compile_convolutional_model()

        model.fit(
            X_train,
            y_train,
            validation_split=0.2,
            epochs=200,
            batch_size=100,
            validation_data=(X_test, y_test),
        )

    # plot_loss(history)
    model.predict(X_test[:1]), y_test[:1]
    model.save(f"{model_type}_base_model")

    print("Evaluate on test data")
    results = model.evaluate(X_test, y_test, verbose=2)
    print("test loss, test acc:", results)


