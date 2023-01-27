import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { TrajectoryPlotComponent } from './plot/trajectory-plot/trajectory-plot.component';
import { BarPlotComponent } from './plot/bar-plot/bar-plot.component';
import { ColorPickerComponent } from './plot/color-picker/color-picker.component';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    EvaluationComponent,
    TrajectoryPlotComponent,
    BarPlotComponent,
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    PlotlyModule
  ]
})
export class EvaluationModule { }
