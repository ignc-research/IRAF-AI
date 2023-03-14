import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Category, PlotDataService} from "../plot-data.service";
import {PlotlyDataLayoutConfig} from "plotly.js-dist-min";
import {BehaviorSubject, Subscription} from 'rxjs';
import {PlotService} from "../plot.service";

@Component({
  selector: 'app-trajectory-plot',
  templateUrl: './trajectory-plot.component.html',
  styleUrls: ['./trajectory-plot.component.scss']
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
      title: this.experimentName,
      showlegend: false
    },
    data: [] as any[]
  };

  constructor(protected plotService: PlotDataService, public plotUiService: PlotService) {
    this.subscriptions.push(this.plotService.categoryChanged.subscribe(x => this.onServiceCategoryChange(x)));
    this.subscriptions.push(this.titleSub.subscribe(x => this.plot.layout.title = x));
  }

  ngOnInit(): void {
    this.loadTrajectoryPlot();
    this.plotUiService.registerTitleSub(this.titleSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.plotUiService.deregisterTitleSub(this.titleSub);
  }

  async loadTrajectoryPlot() {
    this.plot.data = [];

    const experiment = await this.plotService.loadExperiment(this.experimentName);
    this.titleSub.next(this.experimentName);
    experiment.data.forEach(robotData => {
      robotData.trajectories.forEach((trj, i) => {
        const newTrj = {
          ...trj,
          type: 'scatter3d',
          legendgroup: robotData.category.name,
          name: robotData.category.name,
          showlegend: i == 1,
          mode: 'lines',
          line: {
            //color: 'rgb(80, 85, 95)',
            color: robotData.category.color,
            dash: 'dashdot',
          },
        };
        this.plot.data.push(newTrj as any);
      });

      const newAvgTrj = {
        ...robotData.avgTrajectory,
        type: 'scatter3d',
        mode: 'lines',
        legendgroup: `avg_${robotData.category.name}`,
        name: `Average ${robotData.category.name}`,
        line: {
          color: robotData.category.color,
          width: 10,
        }
      };
      this.plot.data.push(newAvgTrj as any);
    });
  }

  titleChange = (ev: any) => {
    const newValue = ev.target.value;
    if (this.selectedTitleSub){
      this.selectedTitleSub.next(newValue);
    }
    // this.plotUiService.titleSubjects.forEach(x => x.next(newValue));
  }

  toggleAverage(eventTarget: any, type: string) {
    const isVisible = eventTarget.checked;
    this.plot.data.filter((data: any) => data.legendgroup === `avg_${type}`).forEach((data: any) => {
      data.visible = isVisible;
    });
  }

  changeLineType(eventTarget: any, type: string) {
    const lineType = eventTarget.value;
    this.plot.data.filter((data: any) => data.legendgroup === type).forEach((data: any) => {
      if (lineType === "none") {
        data.visible = false;
        return;
      }
      data.visible = true;
      data.line.dash = lineType;
    });
  }

  onServiceCategoryChange(category: Category) {
    this.plot.data.filter((data: any) => data.legendgroup === category.name || data.legendgroup === `avg_${category.name}`).forEach((data: any) => {
      data.line.color = category.color;
    });
  }
}
