import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { PlotDataService, Experiment } from '../plot-data.service';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-custom-plot',
  templateUrl: './custom-plot.component.html',
  styleUrls: ['./custom-plot.component.scss'],
})
export class CustomPlotComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() experimentName: string | undefined;
  @Input() customPlotCode: string | undefined;
  @Input() elementId: string | undefined;
  @Input() uniqueKey: any;


  private experiment: Experiment | undefined;

  constructor(private plotDataService: PlotDataService) {}

  ngOnInit(): void {
    if (this.experimentName) {
      this.experiment = this.plotDataService.experiments.find(
        (exp) => exp.name === this.experimentName
      );
    }
  }

  ngAfterViewInit(): void {
    this.renderCustomPlot();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderCustomPlot();
  }

  private renderCustomPlot(): void {
    if (this.experiment && this.customPlotCode && this.elementId) {
      console.log('renderCustomPlot:', this.experimentName, this.customPlotCode, this.elementId);
      try {
        // Prepare data context
        const dataContext: { [key: string]: any[] } = {};
        if (this.experiment) {
          for (const [key, values] of Object.entries(this.experiment.data)) {
            dataContext[key] = values;
          }
        }
        

        // Create a function from the user's custom plot code
        const customPlotFunction = new Function(
          'dataContext',
          'Plotly',
          'elementId',
          `
            const createPlot = () => {
              ${this.customPlotCode}
            };
            const { data, layout } = createPlot(dataContext);
            Plotly.newPlot(elementId, data, layout);
          `
        );

        // Call the customPlotFunction with the data context, Plotly, and elementId
        customPlotFunction(dataContext, Plotly, this.elementId);

      } catch (error) {
        if (error instanceof ReferenceError) {
          console.error('Error: Custom plot definition uses an unknown reference:', error);
        } else {
          console.error('Error while rendering the custom plot:', error);
        }
      }
    }
  }
}

         
