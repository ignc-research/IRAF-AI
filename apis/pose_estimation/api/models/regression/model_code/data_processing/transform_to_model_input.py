import pandas as pd
import numpy as np


def to_np_array(vector_str):
    np_vector = np.array(vector_str.split())
    np_vector = np_vector.astype(np.float32)
    return np_vector

def sample_dataset(dataset, sample_size):
  dataset = dataset.iloc[::int(len(dataset) / (sample_size)),:]

  return dataset

def data_processing(path, sample: bool=False, sample_size: int=20):

    data = pd.DataFrame(
        columns=[
            # "WkzWkl",
            # "WkzName",
            # "Punkt_Pos",
            # "Punkt_Fl_Norm1",
            # "Punkt_Fl_Norm2",
            # "Frame_Pos",
            "Frame_Xvek",
            "Frame_Yvek",
            "Frame_Zvek",
            "hit_nor_pos",
            # "pos",
            # "nor_pos",
            # "csv_name",
        ]
    )
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
        # "Punkt_Pos",
        # "Punkt_Fl_Norm1",
        # "Punkt_Fl_Norm2",
        # "Frame_Pos",
        "Frame_Xvek",
        "Frame_Yvek",
        "Frame_Zvek",
        # "hit_pos",
        "hit_nor_pos",
    )
    df_with_arrays = dataset.copy(deep=True)

    for col in vector_cols:
        df_with_arrays[col] = df_with_arrays[col].apply(to_np_array)

    point_data = df_with_arrays.copy(deep=True).iloc[1, :]
    point_data["hit_nor_pos"] = df_with_arrays["hit_nor_pos"].to_numpy()
    # point_data["hit_fraction"] = (
    #     df_with_arrays["hit_fraction"].to_numpy().astype(np.float32)
    # )

    point_data = point_data.to_frame().T

    point_data = pd.concat([data, point_data], ignore_index=True)

    point_data = pd.concat([point_data.pop(col) for col in ['hit_nor_pos']], axis=1)
    point_data = np.array([np.vstack(arr[0]) for arr in np.array(point_data)])
    
    
    return point_data, dataset_length