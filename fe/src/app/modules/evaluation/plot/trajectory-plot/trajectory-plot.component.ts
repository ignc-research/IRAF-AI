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

  @Input() dataColumn: string = '';


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
  
    Object.values(experiment.episodes).forEach((episodeData: { data: { [key: string]: (number | number[])[] }; episode: number }) => {
      if (!episodeData) return;
    
      const data: { [key: string]: (number | number[])[] } = episodeData.data;
    
      const columnData = data[this.dataColumn];
    
      if (!columnData) return;
    
      const trace = this.createTrace(columnData, episodeData.episode);
    
      if (trace) {
        traces.push(trace);
      }
    });
  
    this.plot.data = traces;
  }
  

  createTrace(data: any, episode: number): any {
    // You can extend this function to handle different types of data.
    // For example, if the data is an array of arrays with three elements (3D positions),
    // create a scatter3d trace.

    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length === 3) {
      const x: number[] = [];
      const y: number[] = [];
      const z: number[] = [];

      data.forEach((position: number[] | number, index) => {
        if (Array.isArray(position) && position.length === 3) {
          x.push(position[0]);
          y.push(position[1]);
          z.push(position[2]);
        }
      });

      return {
        x,
        y,
        z,
        mode: 'lines',
        type: 'scatter3d',
        line: {
          color: this.colorService.getColor(""),
        },
      };
    }
    // Handling 1D data (array of numbers)
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "number") {
      const x: number[] = [];
      const y: number[] = [];

      data.forEach((value: number, index: number) => {
        x.push(index);
        y.push(value);
      });

      return {
        x,
        y,
        mode: 'lines',
        type: 'scatter',
        line: {
          color: this.colorService.getColor(""),
        },
      };
    }

    return null;
  }
}
