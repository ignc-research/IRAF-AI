from email.mime import base
import json
from tensorflow import keras
from .data_processing.create_laser_beam_csvs import generate_beam_files_for_obj
from .data_processing.transform_to_model_input import data_processing
from .data_processing.create_urdf import create_urdf_file
from .data_processing.unit_conversion_obj import convert_units_object_file
from .prediction.non_ml import predict_via_norm
import xml.etree.ElementTree as et
import os.path
import csv
from .training.custom_model import train


def try_create_folder(path):
    try:
        os.mkdir(path)
    except:
        print(f"folder already exists {path}")


def convert_to_urdf(input_data_obj_file, folder_path):
    """1.  UNIT CONVERSION OF OBJ FILE"""
    object_name = os.path.basename(input_data_obj_file).replace(".obj", "")
    path_obj_in_meters = f"{folder_path}/{object_name}_converted.obj"
    convert_units_object_file(
        obj_filepath=input_data_obj_file, path_obj_in_meters=path_obj_in_meters
    )

    """ 2.  CREATE URDF FILE """
    try_create_folder(f"{folder_path}/objects_urdfs")

    urdf_name = f"{object_name}.urdf"
    output_file_path = f"{folder_path}/objects_urdfs/{urdf_name}"
    create_urdf_file(obj_filename=path_obj_in_meters, output_file_path=output_file_path)


def training(
    input_xmls,
    input_objs,
    num_ray,
    model_name,
    model_type,
    num_layers,
    activation_function,
    units,
    sensor_loc_factor,
    epochs,
):

    folder_path = "{}/{}".format("./data/models", model_name)
    try_create_folder("./data/models")
    try_create_folder(folder_path)

    for file in input_objs:
        name = file["name"].replace(".obj", "")
        filePath = f"./data/{name}/{name}.obj"
        try_create_folder(f"./data/{name}")

        with open(filePath, "w") as obj_file:
            obj_file.write(file["file"])
        convert_to_urdf(filePath, f"./data/{name}")

    for file in input_xmls:
        name = file["name"].replace(".xml", "")
        try_create_folder(f"./data/{name}")
        input_data_xml_file = f"./data/{name}/{name}.xml"
        with open(input_data_xml_file, "w") as xml_file:
            xml_file.write(file["file"])

    laser_beam_path = "{}/{}".format(
        folder_path, f"objects_beam_files_num_ray_{num_ray}"
    )
    try:
        os.mkdir(laser_beam_path)
    except:
        print("Folder aready exists")

    """ 1. CREATE LASER BEAM FILES FOLDER """
    dir = [name for name in map(lambda x: x["name"], input_xmls)]

    for file in dir:
        fileBase = file.replace(".xml", "")
        generate_beam_files_for_obj(
            object_xml_file=f"./data/{fileBase}/{file}",
            target_dir=laser_beam_path,
            num_ray=num_ray,
            sensor_loc_factor=sensor_loc_factor,
            miss_fraction=-1,
            _urdf_path=f"./data/{fileBase}/objects_urdfs",
            _type="ml",
        )

    """ 2. TRAIN MODEL """

    train(
        activation_function=activation_function,
        model_name=model_name,
        model_type=model_type,
        num_layers=num_layers,
        units=units,
        beam_files="{}/{}".format(folder_path, f"objects_beam_files_num_ray_{num_ray}"),
        num_ray=num_ray,
        epochs=epochs,
    )


def predict(model_type, model_name, object_name, xml, obj):
    """LOAD ML MODEL IF ML PREDICTION TYPE"""

    if model_type == "ml":
        model = keras.models.load_model(f"prediction/{model_name}")

    """ CREATE FOLDER FOR OBJECT """

    folder_path = f"./data/{object_name}"
    try:
        os.mkdir(folder_path)
    except:
        print("Folder already exists.")

    """ SAVE XML FILE AND OBJ FILE """

    input_data_xml_file = f"{folder_path}/{object_name}.xml"
    input_data_obj_file = f"{folder_path}/{object_name}.obj"

    with open(input_data_xml_file, "w") as xml_file:
        xml_file.write(xml)

    with open(input_data_obj_file, "w") as obj_file:
        obj_file.write(obj)

    """ 1.  UNIT CONVERSION OF OBJ FILE """
    """ 2.  CREATE URDF FILE """
    convert_to_urdf(input_data_obj_file, folder_path)

    """ 3.  CREATE LASER BEAM FILES """

    try:
        os.mkdir(f"{folder_path}/object_beam_files")
    except:
        print("Folder already exists")

    if model_type == "ml":
        if (
            model_name == "convolutional_base_model"
            or model_name == "fully_connected_base_model"
        ):
            num_ray = 5
        else:
            num_ray = int(model_name.split("_")[-1])

    else:
        num_ray = 5

    generate_beam_files_for_obj(
        object_xml_file=input_data_xml_file,
        target_dir=f"{folder_path}/object_beam_files",
        num_ray=num_ray,
        sensor_loc_factor=1,
        miss_fraction=-1,
        _urdf_path=f"./data/{object_name}/objects_urdfs",
        _type=model_type,
    )

    """ 6.  CREATE XML OUTPUT FILE """

    tree = et.parse(input_data_xml_file)
    root = tree.getroot()

    for SNaht in root.findall("SNaht"):
        Name = SNaht.get("Name")
        WkzWkl = SNaht.get("WkzWkl")
        WkzName = SNaht.get("WkzName")

        Punkt_s = SNaht.findall("Kontur")[0].findall("Punkt")
        Frame_s = SNaht.findall("Frames")[0].findall("Frame")

        for i in range(0, len(Punkt_s)):
            beams_file_path = f"{folder_path}/object_beam_files/{object_name}.{Name}.{WkzName}.{WkzWkl}.{i}.csv"
            if os.path.isfile(beams_file_path):
                x_vector = Frame_s[i].find("XVek")
                y_vector = Frame_s[i].find("YVek")
                z_vector = Frame_s[i].find("ZVek")
                if model_type == "ml":
                    """4.  TRANSFORM TO MODEL INPUT"""
                    point_data_model_input = data_processing(beams_file_path)
                    """ 5.  PREDICT """
                    prediction = model.predict(point_data_model_input[0])
                    x_vector.set("X", str(prediction[0][0][0]))
                    x_vector.set("Y", str(prediction[0][0][1]))
                    x_vector.set("Z", str(prediction[0][0][2]))

                    y_vector.set("X", str(prediction[0][1][0]))
                    y_vector.set("Y", str(prediction[0][1][1]))
                    y_vector.set("Z", str(prediction[0][1][2]))

                    z_vector.set("X", str(prediction[0][2][0]))
                    z_vector.set("Y", str(prediction[0][2][1]))
                    z_vector.set("Z", str(prediction[0][2][2]))
                elif model_type == "norm":
                    """5.  PREDICT"""
                    prediction = predict_via_norm(
                        point_beams_file_path=beams_file_path, norm=model_name
                    )

                    x_prediction = prediction["Frame_Xvek"]
                    x_vector.set("X", str(x_prediction[0]))
                    x_vector.set("Y", str(x_prediction[1]))
                    x_vector.set("Z", str(x_prediction[2]))
                    y_prediction = prediction["Frame_Yvek"]
                    y_vector.set("X", str(y_prediction[0]))
                    y_vector.set("Y", str(y_prediction[1]))
                    y_vector.set("Z", str(y_prediction[2]))
                    z_prediction = prediction["Frame_Zvek"]
                    z_vector.set("X", str(z_prediction[0]))
                    z_vector.set("Y", str(z_prediction[1]))
                    z_vector.set("Z", str(z_prediction[2]))

            else:
                SNaht.remove(Frame_s[i])

    tree.write(f"{folder_path}/predictions_{object_name}.xml")

    return f"{folder_path}/predictions_{object_name}.xml"
