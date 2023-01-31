import { AfterViewInit, Component, Input } from '@angular/core';
import { URDFRobot } from 'urdf-loader';

@Component({
  selector: 'app-robot-inspector',
  templateUrl: './robot-inspector.component.html',
  styleUrls: ['./robot-inspector.component.scss']
})
export class RobotInspectorComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    console.log(this.robot)
  }
  
  @Input()
  robot!: URDFRobot;


}
