import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlotlyDataLayoutConfig } from 'plotly.js';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PlotDataService } from '../plot-data.service';
import { PlotService } from '../plot.service';

@Component({
  selector: 'app-bar-plot',
  templateUrl: './bar-plot.component.html',
  styleUrls: ['./bar-plot.component.scss']
})
export class BarPlotComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private titleSub: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input()
  experiments: string[] = [];
  plot: any = {
    layout: {
      autosize: true,
      title: '',
      showlegend: false
    },
    data: []
  }

  constructor(protected plotService: PlotDataService, private plotUiService: PlotService) {}

  ngOnInit(): void {
    // Trigger PlotDataService's onInit() method
    this.plotService.onInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.plotUiService.deregisterTitleSub(this.titleSub);
  }
}
