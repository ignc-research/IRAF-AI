#!/usr/bin/env python3
from xml.dom.minidom import Element
import pybullet as p
import xml.etree.ElementTree as et
import numpy as np
import os
import csv, math


def setup_pb():
    physicsClient = p.connect(p.DIRECT)
    p.resetDebugVisualizerCamera(
        cameraDistance=11.40,
        cameraPitch=-40.40,
        cameraYaw=-4.8,
        cameraTargetPosition=[6.50, 7.59, -3.33],
    )


def generate_hit_for_punkt(
        db_file_path: str,
        Punkt_th: Element,
        Frame_th: Element,
        num_ray: int = 32,
        sensor_loc_factor: float = 1,
        miss_fraction: float = -1,
        _type: str = "norm"
):
    punk_xyz = np.array(
        [float(Punkt_th.get("X")), float(Punkt_th.get("Y")), float(Punkt_th.get("Z"))]
    )
    print(f"Working: punk_xyz={punk_xyz}")

    fl_norms = []
    for Fl_Norm in Punkt_th.findall("Fl_Norm"):
        fl_norms.append(
            (
                [
                    float(Fl_Norm.get("X")),
                    float(Fl_Norm.get("Y")),
                    float(Fl_Norm.get("Z")),
                ]
            )
        )

    frame_veks = []
    Pos = Frame_th.findall("Pos")[0]
    XVek = Frame_th.findall("XVek")[0]
    YVek = Frame_th.findall("YVek")[0]
    ZVek = Frame_th.findall("ZVek")[0]
    frame_veks.append(
        ([float(XVek.get("X")), float(XVek.get("Y")), float(XVek.get("Z"))])
    )
    frame_veks.append(
        ([float(YVek.get("X")), float(YVek.get("Y")), float(YVek.get("Z"))])
    )
    frame_veks.append(
        ([float(ZVek.get("X")), float(ZVek.get("Y")), float(ZVek.get("Z"))])
    )

    hit_pos = []
    nor_pos = []
    hit_fraction = []

    """ Run sim """

    rayFrom = []
    rayTo = []

    sensor_loc = generate_sensor_loc(punk_xyz, fl_norms[0], fl_norms[1], sensor_loc_factor)
    ray_len = np.linalg.norm(punk_xyz - sensor_loc)

    for xy in range(num_ray):
        for z in range(num_ray):
            start_pos = sensor_loc / 1000
            phi = 2.0 * math.pi * float(xy) / num_ray
            theta = 2.0 * math.pi * float(z) / num_ray
            end_pos = [
                s + e
                for s, e in zip(
                    [
                        ray_len * math.sin(phi) * math.cos(theta),
                        ray_len * math.sin(phi) * math.sin(theta),
                        ray_len * math.cos(phi),
                    ],
                    start_pos,
                )
            ]
            rayFrom.append(start_pos)
            rayTo.append(end_pos)

    results = p.rayTestBatch(rayFrom, rayTo)

    for i in range(0, len(results)):
        hitObjectUid = results[i][0]
        if hitObjectUid >= 0:  # hit
            hit_fraction.append(results[i][2])
            hit_pos.append(results[i][3])
            nor_pos.append(results[i][4])
        else:
            hit_fraction.append(miss_fraction)
            hit_pos.append(np.array([0, 0, 0]))
            nor_pos.append(np.array([0, 0, 0]))

    """  """
    if _type == "ml":
        with open(db_file_path, "w+") as naht_csvfile:
            naht_writer = csv.writer(naht_csvfile, delimiter=";")
            naht_writer.writerow(
                [
                    "Frame_Xvek",
                    "Frame_Yvek",
                    "Frame_Zvek",
                    "hit_nor_pos",
                ]
            )
            for hit_th in range(0, len(hit_pos)):
                naht_writer.writerow(
                    [
                        ###
                        " ".join(str(x) for x in frame_veks[0]),
                        " ".join(str(x) for x in frame_veks[1]),
                        " ".join(str(x) for x in frame_veks[2]),
                        ###
                        " ".join(str(x) for x in nor_pos[hit_th]),
                    ]
                )

    elif _type == "norm":
        with open(db_file_path, "w+") as naht_csvfile:
            naht_writer = csv.writer(naht_csvfile, delimiter=";")
            naht_writer.writerow(
                [
                    "Punkt_Fl_Norm1",
                    "Punkt_Fl_Norm2",
                    "Frame_Xvek",
                    "Frame_Yvek",
                    "Frame_Zvek",
                    "hit_fraction",
                ]
            )
            for hit_th in range(0, len(hit_pos)):
                naht_writer.writerow(
                    [
                        " ".join(str(x) for x in fl_norms[0]),
                        " ".join(str(x) for x in fl_norms[1]),
                        ###
                        " ".join(str(x) for x in frame_veks[0]),
                        " ".join(str(x) for x in frame_veks[1]),
                        " ".join(str(x) for x in frame_veks[2]),
                        ###
                        hit_fraction[hit_th],
                    ]
                )


def generate_sensor_loc(schweisspunkt, flnorm_1, flnorm_2, faktor):

    sensor_loc = schweisspunkt + faktor * np.array(flnorm_1) + faktor * np.array(flnorm_2)

    print(f"sensor_loc: punk_xyz={sensor_loc}")

    return sensor_loc


def generate_beam_files_for_obj(
        object_xml_file: str,
        target_dir: str,
        num_ray: int = 32,
        sensor_loc_factor: float = 1.0,
        miss_fraction: float = -1.0,
        _type: str = "norm",
        _urdf_path: str = "../data/objects_urdfs"
):
    """
    For each SchweissPunkt, create a lidar map around and export all rays to csv file.
    If ray didn't hit anything, its hit_fraction (0->ray_len) will be set to `miss_fraction`
    """
    print(f"Create sp {object_xml_file}")

    setup_pb()

    urdf_file = object_xml_file.split("/")[-1].replace(".xml", ".urdf")

    urdf = "{}/{}".format(_urdf_path, urdf_file)

    object_id = p.loadURDF(
        urdf,
        basePosition=[0, 0, 0],
        baseOrientation=[0, 0, 0, 1],
        useFixedBase=True
    )

    tree = et.parse(object_xml_file)
    root = tree.getroot()

    for SNaht in root.findall("SNaht"):
        Name = SNaht.get("Name")
        WkzWkl = SNaht.get("WkzWkl")
        WkzName = SNaht.get("WkzName")

        Punkt_s = SNaht.findall("Kontur")[0].findall("Punkt")
        Frame_s = SNaht.findall("Frames")[0].findall("Frame")

        for i in range(0, len(Punkt_s)):

            db_file_path = f"{target_dir}/{object_xml_file.split('/')[-1].replace('.xml', '')}.{Name}.{WkzName}.{WkzWkl}.{i}.csv"
            generate_hit_for_punkt(
                db_file_path=db_file_path,
                Punkt_th=Punkt_s[i],
                Frame_th=Frame_s[i],
                num_ray=num_ray,
                sensor_loc_factor=sensor_loc_factor,
                miss_fraction=miss_fraction,
                _type=_type
            )


if __name__ == "__main__":

    try:
        os.mkdir("./data/new_database")
    except:
        print("Folder already exists")

    for file in os.listdir("./data/objects_xmls"):
        generate_beam_files_for_obj(
            object_xml_file=f"./data/objects_xmls/{file}",
            target_dir="./data/new_database",
            num_ray=5,
            sensor_loc_factor=100,
            miss_fraction=-1,
            _type="norm"
        )
