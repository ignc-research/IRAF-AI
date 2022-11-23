export class SharedCameraTransform {
    transforms = {};

    deregisterCamera(camera) {
        Object.keys(this.transforms).forEach(x => {
            const idx = this.transforms[x].indexOf(camera);
            if (idx > -1) {
                this.transforms[x].splice(idx, 1);
            }
        })
    }

    registerCamera(name, camera) {
        this.deregisterCamera(camera);
        this.transforms[name] = [...this.transforms[name] ?? [], camera];
    }

    updateByName(name, camera) {
        this.transforms[name].filter(x => x != camera).forEach(x => {
            x.position.copy(camera.position);
            x.quaternion.copy(camera.quaternion);
        })
    }
}