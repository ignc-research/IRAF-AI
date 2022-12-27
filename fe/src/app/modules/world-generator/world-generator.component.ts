import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { NgtAmbientLight, NgtSpotLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtAxesHelper } from '@angular-three/core/helpers';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { RobotComponent } from './components/robot/robot.component';
import { InformationComponent } from './components/information/information.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './world-generator.component.html',
  imports: [
    InformationComponent,
    RobotComponent,
    NgtCanvas,
    NgtAxesHelper,
    NgtAmbientLight,
    NgtSpotLight,
    NgtPointLight,
    NgtSobaOrbitControls],
  styleUrls: ['./world-generator.component.scss']
})

export class WorldGeneratorComponent {
  constructor() {
    


   }
}