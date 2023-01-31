import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/ObjLoader.js';
import URDFLoader, { URDFRobot } from 'urdf-loader';
import { environment } from 'src/environment/environment';
import { Loader, LoadingManager } from 'three';

export class AdvancedUrdfLoader {

  getLoaderByExtension(extension: string, manager?: LoadingManager): Loader | null {
    switch(extension) {
      case 'dae':
        return new ColladaLoader(manager);
      case 'stl':
        return new STLLoader(manager);
      case 'obj':
        return new OBJLoader(manager);
    }
    return null;
  }

  loadRobot(urdfPath: string): Promise<URDFRobot> {
      return new Promise<URDFRobot>((resolve, reject) => {
        const manager = new LoadingManager();
        const loader = new URDFLoader( manager );
    
        const basePath = '/urdf/robot/';
        loader.loadMeshCb = async (url, manager, onLoad) => {
          const fileExt = url.split('.').pop()?.toLowerCase();
          if (fileExt) {
            const loader = this.getLoaderByExtension(fileExt, manager);
            try {
              const result = await loader?.loadAsync(url);

              // Unschön aber solange nur 3 Loader okay
              onLoad(fileExt == 'obj' ? result : result.scene);
            }
            catch (err: any) {
              onLoad(null as any, err);
            }
          }
        }
        loader.load(
          environment.apiUrl + basePath + urdfPath,
          robot => resolve(robot),
          undefined,
          () => reject()
        );
      });
    }
}