import os

def create_urdf_file(obj_filename: str, output_file_path: str):
    name = obj_filename.replace(".obj", "").replace("_converted", "")
    with open(output_file_path, "w+") as out_file:
        text = """<?xml version="1.0" ?>
<robot name="{}">
  <link name="{}__link_0">
    <inertial>
      <mass value="1"/>
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <inertia ixx="0.166667" ixy="0" ixz="0" iyy="0.166667" iyz="0" izz="0.166667"/>
    </inertial>
    <collision name="{}__collision">
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <geometry>
        <mesh filename="{}" scale="1 1 1"/>
      </geometry>
    </collision>
    <visual name="{}__visual">
      <origin xyz="0 0 0" rpy="0 0 0"/>
      <geometry>
        <mesh filename="{}" scale="1 1 1"/>
      </geometry>
    </visual>
  </link>
</robot>
                            """.format(
            name, name, name, obj_filename, name, obj_filename
        )
        out_file.write(text)

# als filename war hier vorher ./objects_objs_converted/ 
# das hat bei mir ebenfalls nicht funktioniert

if __name__ == "__main__":

    try:
        os.mkdir("./data/objects_urdfs")
    except:
        print("Folder already exists")

    for file in os.listdir("./data/objects_objs_converted"):
        name = file.replace(".obj", "").replace("_converted", "")
        urdf_name = f"{name}.urdf"
        output_file_name = '{}/{}'.format("./data/objects_urdfs", urdf_name)
        create_urdf_file(obj_filename=file)
