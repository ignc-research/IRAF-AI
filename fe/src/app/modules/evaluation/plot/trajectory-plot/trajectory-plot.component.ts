import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlotDataService} from "../plot-data.service";
import {PlotlyDataLayoutConfig} from "plotly.js-dist-min";
import {BehaviorSubject, Subscription} from 'rxjs';
import {PlotService} from "../plot.service";

@Component({
  selector: 'app-trajectory-plot',
  templateUrl: './trajectory-plot.component.html',
  styleUrls: ['./trajectory-plot.component.scss']
})
export class TrajectoryPlotComponent{
  
  private subscriptions: Subscription[] = [];
  private titleSub: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public selectedTitleSub?: BehaviorSubject<string>;



  @Input()
  experimentName: string = '';

  
  plot: any = {
    layout: {
      autosize: true,
      title: '',
      showlegend: false
    },
    data: []





}
}

