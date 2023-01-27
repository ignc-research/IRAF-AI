import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { PlotComponent } from './plot/plot.component';
import { TrajectoryPlotComponent } from './plot/trajectory-plot/trajectory-plot.component';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    EvaluationComponent,
    PlotComponent,
    TrajectoryPlotComponent
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    PlotlyModule
  ]
})
export class EvaluationModule { }
