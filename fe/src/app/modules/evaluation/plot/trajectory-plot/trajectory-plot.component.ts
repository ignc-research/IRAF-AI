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
      showlegend: false,

      /* scene: {
        xaxis:{title: 'X AXIS TITLE'}
      }*/
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
    const experiment = await this.plotService.loadExperiment(this.experimentName);

    const startEndData = (experiment.data[0].avgTrajectory as any);
    this.plot.data = [{
      type: 'scatter3d',
      x: [startEndData.x[0], startEndData.x[startEndData.x.length - 1]],
      y: [startEndData.y[0], startEndData.y[startEndData.y.length - 1]],
      z: [startEndData.z[0], startEndData.z[startEndData.z.length - 1]],
      marker: {
        color: 'rgb(17, 157, 255)',
        opacity: 0.5,
        size: 10,

      }
    }];

    this.titleSub.next('Trajectories');
    //this.titleSub.next('Trajectories: ' + this.experimentName);
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



  onServiceCategoryChange(category: Category) {
    this.plot.data.filter((data: any) => data.legendgroup === category.name || data.legendgroup === `avg_${category.name}`).forEach((data: any) => {
      data.line.color = category.color;
      if (data.legendgroup === `avg_${category.name}`) {
        data.visible = category.showAvg;
      }
      else {
        if (category.lineType === "none") {
          data.visible = false;
          return;
        }
        data.visible = true;
        data.line.dash = category.lineType;
      }
    });
  }
}
