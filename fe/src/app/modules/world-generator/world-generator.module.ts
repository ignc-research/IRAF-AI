import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';
import { NgtCanvasModule } from '@angular-three/core';
import { RobotComponent } from './components/robot/robot.component';


@NgModule({
  declarations: [
  ],
  imports: [
    RobotComponent,
    WorldGeneratorComponent,
    CommonModule,
    WorldGeneratorRoutingModule
  ]
})
export class WorldGeneratorModule { }
