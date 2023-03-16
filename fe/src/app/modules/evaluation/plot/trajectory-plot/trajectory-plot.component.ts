import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PlotDataService, Experiment } from '../plot-data.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ColorService } from '../color.service';


@Component({
  selector: 'app-trajectory-plot',
  templateUrl: './trajectory-plot.component.html',
  styleUrls: ['./trajectory-plot.component.scss'],
})
export class TrajectoryPlotComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private titleSub: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public selectedTitleSub?: BehaviorSubject<string>;

  @Input()
  experimentName: string = '';

  plot: any = {
    layout: {
      autosize: true,
      title: '',
      showlegend: false,
    },
    data: [],
  };

  constructor(private plotDataService: PlotDataService, private colorService: ColorService) {}
  

  ngOnInit(): void {
    this.processDataForPlot();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  processDataForPlot(): void {
    const experiment = this.plotDataService.experiments.find(
      (exp) => exp.name === this.experimentName
    );
  
    if (!experiment) return;
  
    const traces: any[] = [];
  
    experiment.data.forEach((episodeData) => {
      if (!episodeData) return;
  
      const x: number[] = [];
      const y: number[] = [];
      const z: number[] = [];
  
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
  
      linkPositions.forEach((position: number[] | number, index) => {
        if (Array.isArray(position) && position.length === 3) {
          x.push(position[0]);
          y.push(position[1]);
          z.push(position[2]);
        }
      });
    
      const trace = {
        x,
        y,
        z,
        mode: 'lines',
        type: 'scatter3d',
        line: {
          color: this.colorService.getColor(episodeData.episode),
        },
      };
  
      traces.push(trace);
    });
  
    this.plot.data = traces;
  }
  
  
}
