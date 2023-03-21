import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {PlotService} from "../plot.service";
import {Category, PlotDataService} from "../plot-data.service";

@Component({
  selector: 'app-radar-plot',
  templateUrl: './radar-plot.component.html',
  styleUrls: ['./radar-plot.component.scss']
})
export class RadarPlotComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private titleSub: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input()
  experimentName: string = '';

  plot: any = {
    layout: {
      autosize: true,
      //title: this.experiments,
      title: '',
      showlegend: false
    },
    data: [

    ]
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
    this.loadRadarPlot();
  }

  async loadRadarPlot() {
    const experiment = await this.plotService.loadExperiment(this.experimentName);
    this.titleSub.next('Metric');
    //this.titleSub.next('Metric: ' + this.experimentName);
    this.plot.data = this.plotService.categories.map(cat => {
      const avgExecutionTime = experiment.data.find(x => x.category.name == cat.name)?.avgExecutionTime ?? 0;
      const avgPathLength = experiment.data.find(x => x.category.name == cat.name)?.avgPathLength ?? 0;
      const random1 = Math.random() * 2;
      const random2 = Math.random() * 2;

      return {
        //type: 'bar',
        //x: experiments.map(x => x.name),
        //y: experiments.map(y => y.data.find(x => x.category.name == cat.name)?.avgPathLength ?? 0),
        type: 'scatterpolar',
        r: [avgExecutionTime, avgPathLength, random1, random2],
        theta: ['Avg. Ex. Time','Avg Path Len','Avg Computation Time', 'Max Path Length'],
        fill: 'toself',
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
