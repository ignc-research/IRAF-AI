import * as THREE from 'three';
import { AppSettings } from '../../AppSettings';

export class TorchAnimation {
    to;
    torch;
    animationSpeed;
    lastUpdate = Date.now();
    cb;
    state = 1;
    steps = []
    duration = 0

    getDistance = (to, from) => new THREE.Vector3(from.x, from.y, from.z).distanceTo(new THREE.Vector3(to.x, to.y, to.z));

    constructor(from, to, torch, cb, animationSpeed = 1) {
        torch.matrix = TorchAnimation.getMatrix(from);
        this.to = TorchAnimation.getMatrix(to);

        const maxDistance = [
            this.getDistance(from.position, to.position),
            this.getDistance(from.rotation.xVec, to.rotation.xVec) * 500,
            this.getDistance(from.rotation.yVec, to.rotation.yVec) * 500,
            this.getDistance(from.rotation.zVec, to.rotation.zVec) * 500
        ];

        this.duration = Math.max(...maxDistance);
        this.steps = this.to.elements.map((x, i) => ((x - torch.matrix.elements[i]) / this.duration) * .01 * animationSpeed);

        this.torch = torch;
        this.animationSpeed = animationSpeed;
        this.cb = cb;
    }
    
    // ToDo: Für Regression normiere ich hier nochmal extra?
    static getVector = (vector) => new THREE.Vector3(vector.x, vector.y, vector.z).normalize().multiplyScalar(AppSettings.scaleFactor);

    static getMatrix = (point) => {
        let matrix = new THREE.Matrix4();
        let xVec = this.getVector(point.rotation.xVec);
        let yVec = this.getVector(point.rotation.yVec);
        let zVec = this.getVector(point.rotation.zVec);
        matrix.set( 
            xVec.x, yVec.x, zVec.x, point.position.x,
            xVec.y, yVec.y, zVec.y, point.position.y,
            xVec.z, yVec.z, zVec.z, point.position.z,
            0, 0, 0, 1);
        return matrix;
    }

    
    getNewMatrix = () => {
        const from = this.torch.matrix;
        for (let i = 0; i < 16; i++) {
            const difference = this.to.elements[i] - from.elements[i];
            if (Math.sign(this.steps[i]) != Math.sign(difference)
            || Math.abs(difference) < .00000000001
            || from.elements[i] == this.to.elements[i]) {
                from.elements[i] = this.to.elements[i];
                continue;
            }
            from.elements[i] += (this.steps[i] * (Date.now() - this.lastUpdate));
        }
        return from;
    }

    update = () => {
        this.torch.matrix = this.getNewMatrix();
        if (this.torch.matrix.equals(this.to) || this.animId == -1) {
            this.cb(this.animId);
            return;
        }
        this.lastUpdate = Date.now();
    }

    stop = () => {
        this.state = -1;
    };

    unpause = () => {
        this.state = 1;
    }

    pause = () => {
        this.state = 0;
    }
}