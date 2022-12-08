import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoseEstimationComponent } from './pose-estimation.component';

const routes: Routes = [
  {
    path: '',
    component: PoseEstimationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoseEstimationRoutingModule { }
