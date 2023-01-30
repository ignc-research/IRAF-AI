import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  selectedObject: BehaviorSubject<THREE.Object3D | null> = new BehaviorSubject<THREE.Object3D | null>(null);

  constructor() { }
}
export type Robot = {
  urdf: string;
}