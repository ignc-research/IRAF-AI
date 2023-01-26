import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';
import { NgtCanvasModule } from '@angular-three/core';
import { RobotComponent } from './components/robot/robot.component';
import { InformationComponent } from './components/information/information.component';
import { PopoverComponent } from './components/popover/popover.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    RobotComponent,
    InformationComponent,
    WorldGeneratorComponent,
    CommonModule,
    WorldGeneratorRoutingModule,
    PopoverComponent,
    NgtCanvasModule,
    
  ]
})
export class WorldGeneratorModule { }
