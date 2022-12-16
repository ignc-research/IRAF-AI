// world-generator.component.ts
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scene, PerspectiveCamera, DirectionalLight, Group, LoadingManager, Color, WebGLRenderer, Object3D, PointLight, AmbientLight, Raycaster, Vector2, PCFSoftShadowMap, Mesh, MeshStandardMaterial, PlaneBufferGeometry } from 'three';
import URDFLoader from 'urdf-loader';
import { URDFJoint } from 'urdf-loader';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as THREE from 'three';

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
  controls!: TrackballControls;
  raycaster: Raycaster;

  constructor() {
    this.scene = new Scene();
    this.raycaster = new Raycaster();
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.light = new DirectionalLight(0xffffff, 1);
    this.group = new Group();
    this.manager = new LoadingManager();
    this.loader = new URDFLoader(this.manager);
    this.scene.background = new Color(0x1c252e);
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 10);
    this.light.position.set(0, 0, 10);
    
    // Add an AmbientLight to the scene
    const ambientLight = new AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Add a PointLight to the scene
    const pointLight = new PointLight(0xffffff, 0.6);
    pointLight.position.set(0, 0, 20);
    this.scene.add(pointLight);

    // Create a PlaneBufferGeometry
    const geometry = new PlaneBufferGeometry(100, 30);

    // Create a MeshStandardMaterial and set its color to a light gray
    const material = new MeshStandardMaterial({ color: 0x2c3640 });
    material.side = THREE.DoubleSide;

    // Create a Mesh using the geometry and material
    const plane = new Mesh(geometry, material);

    // Enable shadow casting and receiving for the plane and robot
    plane.castShadow = true;
    plane.receiveShadow = true;

    // Set the position of the plane so that it's bottom is at y=0
    plane.position.set(0, 0, 0);

    // Rotate the plane 90 degrees on the x-axis to make it horizontal
    plane.rotation.set(0, 0, 0);

    // Add the plane to the scene
    this.scene.add(plane);

    // Set up the Raycaster to detect intersections with the robot model
    this.raycaster = new Raycaster();

    //this.loader.load('/assets/urdf/kuka/urdf/kr120r2500pro.urdf', (robot) => {
    this.loader.load('/assets/urdf/T12/urdf/T12.URDF', (robot) => {

      // Enable shadow casting and receiving for the robot
      robot.castShadow = true;
      robot.receiveShadow = true;
      robot.position.set(0, 0, 3);

      console.log(robot);
      this.scene.add(robot);
      
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
  
    // Add a resize event listener to the window object
    window.addEventListener('resize', () => {
      // Update the renderer's size to match the size of the canvas element
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    });

    // Create an instance of TrackballControls
    this.controls = new TrackballControls(this.camera, this.canvas);

    //this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 25;
    this.controls.rotateSpeed = 10;
    this.controls.zoomSpeed = 1.2;


    // Add a click event listener to the canvas element
    this.canvas.addEventListener('click', (event) => {
      // Create a new Raycaster
      const raycaster = new Raycaster();

      // Set the Raycaster to use the camera's position and the mouse's position on the canvas
      raycaster.setFromCamera(new Vector2(event.clientX, event.clientY), this.camera);

      // Use the Raycaster to check if the user's click intersects with any objects in the scene
      const intersects = raycaster.intersectObjects(this.scene.children);

      // If there are any intersections, log the first intersected object to the console
      if (intersects.length > 0) {
        console.log(intersects[0].object);
      }
    });

  
    // Add a requestAnimationFrame() loop that calls the update() function
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }
}