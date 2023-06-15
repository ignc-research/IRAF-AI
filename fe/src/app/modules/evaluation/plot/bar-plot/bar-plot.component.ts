import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PlotDataService, Experiment } from '../plot-data.service';
import { ColorService } from '../color.service';


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

  @Input() dataColumn: string = '';


  constructor(private plotDataService: PlotDataService, private colorService: ColorService) {}

  ngOnInit(): void {
    this.createBarPlot();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  createBarPlot(): void {
    const experiment = this.plotDataService.experiments.find(
      (exp) => this.experiments.includes(exp.name)
    );

    if (!experiment) return;

    const avgData: { [episode: number]: number } = {};

    Object.values(experiment.episodes).forEach((episodeData: { data: { [key: string]: (number | number[])[] }; episode: number }) => {
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

    const trace = {
      x: Object.keys(avgData).map((episode) => `Episode ${episode}`),
      y: Object.values(avgData),
      type: 'bar',
      marker: {
        color: Object.keys(avgData).map((episode) => this.colorService.getColor("")),
      },
    };

    this.plot.data = [trace];
  }
}
