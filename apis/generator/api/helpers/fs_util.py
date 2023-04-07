import glob
import os

ASSET_PATH = "./ir_drl/modular_drl_env/assets/"
OBSTACLE_PATH = "./ir_drl/modular_drl_env/world/obstacles/"
ROBOTS_PATH = os.path.join(ASSET_PATH, 'robots')
WORKSPACE_PATH = os.path.join(ASSET_PATH, 'workspace')
HUMAN_PATH = os.path.join(OBSTACLE_PATH, "human_lib/human/man")

CONFIG_PATH = "./ir_drl/configs/"

def findUrdfs(search_name, path):
    files = list(glob.iglob(os.path.join(path, f"{search_name}.urdf"), recursive=True))
    return list(map(lambda x: os.path.relpath(x, path).replace(os.sep, '/'), files))

def getConfigPath(name: str):
    return os.path.join(CONFIG_PATH, f"{name}.yaml")

def getConfigs():
    files = list(glob.iglob(os.path.join(CONFIG_PATH, "*.yaml"), recursive=True))
    return list(map(lambda x: os.path.splitext(os.path.basename(x))[0], files))

def deleteConfig(name: str):
    os.remove(getConfigPath(name))

def writeConfig(name: str, content: str):
    with open(getConfigPath(name), "w") as file:
        file.write(content)

def getConfig(name: str):
    with open(getConfigPath(name), "r") as file:
        return file.read()
    
    