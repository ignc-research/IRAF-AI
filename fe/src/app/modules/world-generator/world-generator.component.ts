import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';
import { NgtAmbientLight, NgtSpotLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtAxesHelper } from '@angular-three/core/helpers';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { RobotComponent } from './components/robot/robot.component';
import { InformationComponent } from './components/information/information.component';
import { Object3D } from 'three';
import { URDFJoint } from 'urdf-loader';
import { PopoverComponent } from './components/popover/popover.component';
import { SharedModule } from './components/shared.module';

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
    NgtSobaOrbitControls,
    PopoverComponent,
    SharedModule],
  styleUrls: ['./world-generator.component.scss']
})

export class WorldGeneratorComponent {
  constructor() {
   this.enableZoom = true;
  }

  dataObject?: {
    hoverObject: Object3D | null,
    currentJoint: URDFJoint | null,
    currentJointValue: Number,
    selectedJoint: URDFJoint | null,
    showPopover: boolean;
    popoverPosition: {x: number, y: number};
  }

  showPopover: boolean = false;
  popoverPosition: {x: number, y: number} = {x:0, y:0};
  enableZoom?: boolean;

    changeDataObject(object: any) {
      this.dataObject = object;
      if(this.dataObject?.hoverObject) {
        this.enableZoom = false;
      } else {
        this.enableZoom = true;
      }
      if(this.dataObject?.showPopover) {
        this.showPopover = this.dataObject?.showPopover;
        this.popoverPosition = this.dataObject?.popoverPosition;
        console.log(this.dataObject?.popoverPosition);
      } else {
        this.showPopover = false;
      }
    }

  
}