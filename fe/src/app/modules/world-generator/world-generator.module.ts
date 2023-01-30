import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';
import { NgtCanvasModule } from '@angular-three/core';
import { RobotComponent } from './components/robot/robot.component';
import { InformationComponent } from './components/information/information.component';
import { PopoverComponent } from './components/popover/popover.component';
import { TransformControlsDirective } from './directives/transform-controls.directive';
import { SensorComponent } from './components/sensor/sensor.component';
import { UserDataComponent } from './components/information/user-data/user-data.component';



@NgModule({
  declarations: [
  ],
  imports: [
    RobotComponent,
    PopoverComponent,
    InformationComponent,
    WorldGeneratorComponent,
    PopoverComponent,
    CommonModule,
    WorldGeneratorRoutingModule,
    NgtCanvasModule,
  ]
})
export class WorldGeneratorModule { }
