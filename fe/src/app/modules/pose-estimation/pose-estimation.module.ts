import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoseEstimationRoutingModule } from './pose-estimation-routing.module';
import { PoseEstimationComponent } from './pose-estimation.component';


@NgModule({
  declarations: [
    PoseEstimationComponent
  ],
  imports: [
    CommonModule,
    PoseEstimationRoutingModule
  ]
})
export class PoseEstimationModule { }
