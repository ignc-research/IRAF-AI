import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlotlyDataLayoutConfig } from 'plotly.js';
import {BehaviorSubject, Subscription} from 'rxjs';
import { Category, PlotDataService } from '../plot-data.service';
import {PlotService} from "../plot.service";

@Component({
  selector: 'app-bar-plot',
  templateUrl: './bar-plot.component.html',
  styleUrls: ['./bar-plot.component.scss']
})
export class BarPlotComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private titleSub: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input()
  experiments: Experiment[];
  //experiments: string = '';
  plot: any = {
    layout: {
      autosize: true,
      //title: this.experiments,
      title: '',
      showlegend: false
    },
    data: []
  }

  constructor(protected plotService: PlotDataService, private plotUiService: PlotService) {
    this.subscriptions.push(this.plotService.categoryChanged.subscribe(this.onServiceCategoryChange));
    this.subscriptions.push(this.titleSub.subscribe(x => this.plot.layout.title = x));

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.plotUiService.deregisterTitleSub(this.titleSub);
  }

  ngOnInit(): void {
    this.plotUiService.registerTitleSub(this.titleSub);
    this.loadBarPlot();
  }

  async loadBarPlot() {
    const experiments = await Promise.all(this.experiments.map(async(x) => await this.plotService.loadExperiment(x)));
    this.titleSub.next(this.experiments.join(', '));
    this.plot.data = this.plotService.categories.map(cat => {
      return {
        type: 'bar',
        x: experiments.map(x => x.name),
        y: experiments.map(y => y.data.find(x => x.category.name == cat.name)?.avgPathLength ?? 0),
        name: cat.name,
        marker: {
          color: cat.color
        }
      }
    });
  }

  onServiceCategoryChange = (category: Category) => {
    this.plot.data.filter((data: any) => data.name === category.name).forEach((data: any) => {
      data.marker.color = category.color;
    });
  }

}
