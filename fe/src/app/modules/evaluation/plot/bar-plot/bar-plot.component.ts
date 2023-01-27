import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlotlyDataLayoutConfig } from 'plotly.js';
import { Subscription } from 'rxjs';
import { Category, PlotService } from '../plot.service';

@Component({
  selector: 'app-bar-plot',
  templateUrl: './bar-plot.component.html',
  styleUrls: ['./bar-plot.component.scss']
})
export class BarPlotComponent implements OnInit, OnDestroy {
  private categoryChangeSub: Subscription;

  @Input()
  experiments: string[] = [];

  plot: any;

  constructor(protected plotService: PlotService) {
    this.categoryChangeSub = this.plotService.categoryChanged.subscribe(this.onServiceCategoryChange);
  }
  ngOnDestroy(): void {
    this.categoryChangeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadBarPlot();
  }

  async loadBarPlot() {
    const experiments = await Promise.all(this.experiments.map(async(x) => await this.plotService.loadExperiment(x)));
    
    const newPlot: PlotlyDataLayoutConfig = {
      layout: {
        autosize: true,
        title: this.experiments.join(', '),
        showlegend: false
      },
      data: this.plotService.categories.map(cat => {
        return {
          type: 'bar',
          x: experiments.map(x => x.name),
          y: experiments.map(y => y.data.find(x => x.category.name == cat.name)?.avgPathLength ?? 0),
          name: cat.name,
          marker: {
            color: cat.color
          }
        }
      })
    };
    this.plot = newPlot;

  }

  onServiceCategoryChange = (category: Category) => {
    this.plot.data.filter((data: any) => data.name === category.name).forEach((data: any) => {
      data.marker.color = category.color;
    });
  }

}
