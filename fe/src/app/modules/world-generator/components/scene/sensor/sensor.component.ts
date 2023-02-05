import { NgtVector3, Ref } from '@angular-three/core';
import { Component, Input, OnInit } from '@angular/core';
import { URDFLink, URDFRobot } from 'libs/urdf-loader/URDFLoader';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneObjectType } from 'src/app/models/scene-object-type';
import { UiControlService } from '../../../services/ui-control.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit {
  @Input()
  sensor!: Sensor;

  @Input()
  robot!: Robot;

  constructor(private uiService: UiControlService) {
    
  }
  
  ngOnInit(): void {
    this.uiService.selectedObject = this.sensor;
  }

  get link() {
    if (!this.robot || !this.robot.ref.value || !this.sensor) {
      return null;
    }
    return (this.robot.ref.value as URDFRobot).links[this.sensor.link];
  }
}
