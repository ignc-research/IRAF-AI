import os


def convert_units_object_file(obj_filepath: str, path_obj_in_meters: str):
    with open(obj_filepath, "r") as in_file:
        for line in in_file.readlines():
            if line[0:1] == "v":
                new_line = "v "
                new_line += str(float(line.split()[1]) / 1000.0) + " "
                new_line += str(float(line.split()[2]) / 1000.0) + " "
                new_line += str(float(line.split()[3]) / 1000.0) + "\n"
                out_file = open(path_obj_in_meters, "a")
                out_file.write(new_line)
            else:
                out_file = open(path_obj_in_meters, "a")
                out_file.write(line)


if __name__ == "__main__":
    try:
        os.mkdir("./data/objects_objs_converted")
    except:
        print("Folder already exists")

    for file in os.listdir("./data/objects_objs"):
        object_name = file.split("/")[-1].replace(".obj", "")
        path_obj_in_meters = (
            f"./data/objects_objs_converted/{object_name}_converted.obj"
        )
        convert_units_object_file(
            obj_filepath=f"./data/objects_objs/{file}",
            path_obj_in_meters=path_obj_in_meters,
        )
