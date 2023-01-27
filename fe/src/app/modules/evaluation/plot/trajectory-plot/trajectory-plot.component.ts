import {Component, Input} from '@angular/core';
import {Category, PlotService} from "../plot.service";
import {PlotlyDataLayoutConfig} from "plotly.js-dist-min";

@Component({
  selector: 'app-trajectory-plot',
  templateUrl: './trajectory-plot.component.html',
  styleUrls: ['./trajectory-plot.component.scss']
})
export class TrajectoryPlotComponent {
  dataLoaded = () => this.plotService.experiments;


  @Input()
  experimentName: string = '';

  trajectoryPlot!: any;

  constructor(protected plotService: PlotService) {
  }

  async loadTrajectoryPlot() {
    const newPlot: PlotlyDataLayoutConfig = {
      // ['DRL', 'RRT'] -->types
      // --> 'DRL, RRT'
      layout: {
        autosize: true,
        title: this.experimentName,
        xaxis: {
          title: 'x-axis title'
        },
        yaxis: {
          title: 'y-axis title'
        },
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
            color: 'rgb(135,206,250)',
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
          color: 'blue',
          width: 10,
        }
      };
      newPlot.data.push(newAvgTrj as any);
    });

    this.trajectoryPlot = newPlot;
  }



  titleChange = (ev: any) => {
    const newValue = ev.target.value;
    this.trajectoryPlot.layout.title = newValue;
  }



  toggleAverage(eventTarget: any, type: string) {
    const isVisible = eventTarget.checked;
    this.trajectoryPlot.data.filter((data: any) => data.legendgroup === `avg_${type}`).forEach((data: any) => {
      data.visible = isVisible;
    });
  }

  changeLineType(eventTarget: any, type: string) {
    const lineType = eventTarget.value;
    this.trajectoryPlot.data.filter((data: any) => data.legendgroup === type).forEach((data: any) => {
      if (lineType === "none") {
        data.visible = false;
        return;
      }
      data.visible = true;
      data.line.dash = lineType;
    });
  }

  onServiceCategoryChange(category: Category) {
    this.trajectoryPlot.data.filter((data: any) => data.legendgroup === category.name || data.legendgroup === `avg_${category.name}`).forEach((data: any) => {
      data.line.color = category.color;
    });
  }

  changeColor (eventTarget: any, type: string): void {
    const inputColor = eventTarget.value;

  }


  ngOnInit() {

  }
}
