import glob
import os

ASSET_PATH = "./ir_drl/assets/"
OBSTACLE_PATH = "./ir_drl/world/obstacles/"
ROBOTS_PATH = os.path.join(ASSET_PATH, 'robots')
WORKSPACE_PATH = os.path.join(ASSET_PATH, 'workspace')
HUMAN_PATH = os.path.join(OBSTACLE_PATH, "human_lib/human/man")

def findUrdfs(search_name, path):
    files = list(glob.iglob(os.path.join(path, f"{search_name}.urdf"), recursive=True))
    return list(map(lambda x: os.path.relpath(x, path).replace(os.sep, '/'), files))
