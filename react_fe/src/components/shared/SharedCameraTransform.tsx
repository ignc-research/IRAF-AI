export class SharedCameraTransform {
    transforms: { [key: string]: THREE.Camera[] } = {};

    deregisterCamera(camera: THREE.Camera) {
        Object.keys(this.transforms).forEach(x => {
            const idx = this.transforms[x].indexOf(camera);
            if (idx > -1) {
                this.transforms[x].splice(idx, 1);
            }
        })
    }

    registerCamera(name: string, camera: THREE.Camera) {
        this.deregisterCamera(camera);
        this.transforms[name] = [...this.transforms[name] ?? [], camera];
    }

    updateByName(name: string, camera: THREE.Camera) {
        this.transforms[name].filter(x => x != camera).forEach(x => {
            x.position.copy(camera.position);
            x.quaternion.copy(camera.quaternion);
        })
    }
}