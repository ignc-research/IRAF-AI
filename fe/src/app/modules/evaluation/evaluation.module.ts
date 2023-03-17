import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { MatDialogModule } from '@angular/material/dialog';
import { TrajectoryPlotComponent } from './plot/trajectory-plot/trajectory-plot.component';
import { BarPlotComponent } from './plot/bar-plot/bar-plot.component';
import { LinePlotComponent } from './plot/line-plot/line-plot.component';
import { ColorPickerComponent } from './plot/color-picker/color-picker.component';
import {FormsModule} from "@angular/forms";
import { DataTableComponent } from './plot/data-table/data-table.component';


PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    EvaluationComponent,
    TrajectoryPlotComponent,
    BarPlotComponent,
    ColorPickerComponent,
    LinePlotComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    FormsModule,
    PlotlyModule,
    MatDialogModule,
  ]
})
export class EvaluationModule { }
