// world-generator.component.ts
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scene, PerspectiveCamera, DirectionalLight, Group, LoadingManager, Color, WebGLRenderer } from 'three';
import URDFLoader from 'urdf-loader';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-world-generator',
  templateUrl: './world-generator.component.html',
  styleUrls: ['./world-generator.component.scss']
})

export class WorldGeneratorComponent {
  scene: Scene;
  camera: PerspectiveCamera;
  light: DirectionalLight;
  loader: URDFLoader;
  manager: LoadingManager;
  group: Group;
  canvas!: HTMLCanvasElement;
  renderer!: WebGLRenderer;
  controls!: OrbitControls;


  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.light = new DirectionalLight(0xffffff, 1);
    this.group = new Group();
    this.manager = new LoadingManager();
    this.loader = new URDFLoader(this.manager);
    this.scene.background = new Color(0x000000);
    this.camera.position.set(0, 0, 10);
    this.light.position.set(0, 0, 10);
    this.scene.add(this.light);
    this.scene.add(this.group);
    this.manager.onLoad = () => {
      this.group.position.set(0, 0, 0);
      this.group.scale.set(0.1, 0.1, 0.1);
      this.group.rotation.set(0, 0, 0);
    };
    this.loader.load('/assets/urdf/T12/urdf/T12.URDF', (robot) => {
      this.group.add(robot);
    });
  }

  update() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  ngOnInit() {
    // Get the canvas element from the DOM
    this.canvas = document.getElementById('world-generator-canvas') as HTMLCanvasElement;

    // Log the canvas element to the console
    console.log(this.canvas);
  
    // Create a WebGLRenderer and set its size
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  
    // Add a resize event listener to the window object
    window.addEventListener('resize', () => {
      // Update the renderer's size to match the size of the canvas element
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });

    // Create an instance of OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

  
    // Add a requestAnimationFrame() loop that calls the update() function
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }
}