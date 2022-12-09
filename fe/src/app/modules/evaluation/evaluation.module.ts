import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';


@NgModule({
  declarations: [
    EvaluationComponent
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule
  ]
})
export class EvaluationModule { }
