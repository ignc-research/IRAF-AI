export class ThreeUtils {
    public static isChildOf(obj: THREE.Object3D, parent: THREE.Object3D) {
        let searchObj: THREE.Object3D | null = obj;
        while(searchObj && searchObj != parent) {
          searchObj = searchObj.parent;
        }
        return searchObj;
    }
}