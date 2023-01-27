import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Category, PlotService} from "../plot.service";
import {PlotlyDataLayoutConfig} from "plotly.js-dist-min";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trajectory-plot',
  templateUrl: './trajectory-plot.component.html',
  styleUrls: ['./trajectory-plot.component.scss']
})
export class TrajectoryPlotComponent implements OnInit, OnDestroy {
  private colorChangeSubscription: Subscription;

  @Input()
  experimentName: string = '';

  plot!: any;

  constructor(protected plotService: PlotService) {
    this.colorChangeSubscription = this.plotService.categoryChanged.subscribe(x => this.onServiceCategoryChange(x));
  }

  ngOnInit(): void {
    this.loadTrajectoryPlot();
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }

  async loadTrajectoryPlot() {
    const newPlot: PlotlyDataLayoutConfig = {
      layout: {
        autosize: true,
        title: this.experimentName,
        showlegend: false
      },
      data: [] as any[]
    };

    const experiment = await this.plotService.loadExperiment(this.experimentName);
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
        newPlot.data.push(newTrj as any);
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
      newPlot.data.push(newAvgTrj as any);
    });

    this.plot = newPlot;
  }



  titleChange = (ev: any) => {
    const newValue = ev.target.value;
    this.plot.layout.title = newValue;
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
