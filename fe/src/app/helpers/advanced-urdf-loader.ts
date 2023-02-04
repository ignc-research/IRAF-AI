import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/ObjLoader.js';
import URDFLoader, { URDFRobot } from 'libs/urdf-loader/URDFLoader';
import { environment } from 'src/environment/environment';
import { Loader, LoadingManager } from 'three';
import * as THREE from 'three';

export class AdvancedUrdfLoader {

  async loadByExtension(path: string, manager?: LoadingManager): Promise<THREE.Object3D> {
    const fileExt = path.split('.').pop()?.toLowerCase();

    switch(fileExt) {
      case 'dae':
        const daeLoader = new ColladaLoader(manager);
        const dae = await daeLoader.loadAsync(path);
        return dae.scene;
      case 'stl':
        const stlLoader = new STLLoader(manager);
        const geom = await stlLoader.loadAsync(path);
        const mesh = new THREE.Mesh(geom, new THREE.MeshPhongMaterial());
        return mesh;
      case 'obj':
        const objLoader = new OBJLoader(manager);
        const obj = await objLoader.loadAsync(path);
        return obj;
    }
    throw "Invalid File Format";
  }

  loadUrdf(urdfPath: string): Promise<URDFRobot> {
      return new Promise<URDFRobot>((resolve, reject) => {
        const manager = new LoadingManager();
        const loader = new URDFLoader( manager );
    
        console.log()
        loader.packages = `${environment.apiUrl}/${urdfPath.substring(0, urdfPath.lastIndexOf('/'))}`;
        loader.loadMeshCb = async (url, manager, onLoad) => {
          try {
            const result = await this.loadByExtension(url, manager);
            onLoad(result);
          }
          catch (err: any) {
            onLoad(null as any, err);
          }

        }

          loader.load(
            environment.apiUrl + urdfPath,
            robot => resolve(robot),
            undefined,
            ((err: any) => reject(err)) as any
          );
    
        
      });
    }
}