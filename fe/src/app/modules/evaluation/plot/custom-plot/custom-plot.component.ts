import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { PlotDataService, Experiment } from '../plot-data.service';
import * as Plotly from 'plotly.js-dist-min';
import { Subject } from 'rxjs';


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
  @Input() globalVariableAdded: Subject<void> | undefined;
  @Input() darkMode: boolean = false;




  private experiment: Experiment | undefined;

  constructor(private plotDataService: PlotDataService, private elRef: ElementRef, private renderer: Renderer2) {}

  

  ngOnInit(): void {
    if (this.experimentName) {
      this.experiment = this.plotDataService.experiments.find(
        (exp) => exp.name === this.experimentName
      );
    }
  
    // Subscribe to globalVariableAdded and re-render the plot when a new variable is added
    if (this.globalVariableAdded) {
      this.globalVariableAdded.subscribe(() => {
        this.renderCustomPlot();
      });
    }
  }
  

  ngAfterViewInit(): void {
    this.renderCustomPlot();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderCustomPlot();
    if (this.darkMode) {
      this.renderer.addClass(this.elRef.nativeElement, 'dark-mode');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dark-mode');
    }
  }

  private renderCustomPlot(): void {
    if (this.experiment && this.customPlotCode && this.elementId) {
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

         
