import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PlotDataService, Experiment } from '../plot-data.service';
import { Data, Layout, Config } from 'plotly.js';

@Component({
  selector: 'app-line-plot',
  templateUrl: './line-plot.component.html',
  styleUrls: ['./line-plot.component.scss'],
})
export class LinePlotComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Input() experimentName: string = ''; // Add a default value here
  @Input() dataColumn: string = '';


  plot: any = {
    layout: {},
    data: [],
    config: {},
  };

  constructor(private plotDataService: PlotDataService) {}

  ngOnInit(): void {
    this.createLinePlot();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  createLinePlot(): void {
    const experiment = this.plotDataService.experiments.find(
      (exp) => exp.name === this.experimentName
    );

    if (!experiment) return;

    const avgData: { [episode: number]: number } = {};

    experiment.data.forEach((episodeData) => {
      if (!episodeData) return;

      let linkPositions;
      for (const key in episodeData.data) {
        const data = episodeData.data[key];
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          Array.isArray(data[0]) &&
          data[0].length === 3
        ) {
          linkPositions = data;
          break;
        }
      }

      if (!linkPositions) return;

      let totalDist = 0;
      let numPositions = 0;

      linkPositions.forEach((position: number[] | number) => {
        if (Array.isArray(position) && position.length === 3) {
          const [x, y, z] = position;
          const dist = Math.sqrt(x * x + y * y + z * z);
          totalDist += dist;
          numPositions += 1;
        }
      });

      const avgDist = totalDist / numPositions;
      avgData[episodeData.episode] = avgDist;
    });

    const trace: Data = {
      x: Object.keys(avgData).map((episode) => `Episode ${episode}`),
      y: Object.values(avgData),
      type: 'scatter3d',
      mode: 'lines+markers',
      marker: { color: 'red' },
    };

    this.plot.data = [trace];
  }
}
