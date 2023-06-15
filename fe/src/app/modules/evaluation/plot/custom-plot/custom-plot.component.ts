import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { PlotDataService, Experiment } from '../plot-data.service';
import * as Plotly from 'plotly.js-dist-min';
import { Subject } from 'rxjs';
import { ColorService } from '../color.service';


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
  @Input() dataContext: { [key: string]: { [key: string]: any[] } } = {};


  private experiment: Experiment | undefined;

  constructor(
    private plotDataService: PlotDataService, 
    private elRef: ElementRef, 
    private renderer: Renderer2, 
    private colorService: ColorService
    ) {}

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
    if (changes['darkMode']) {
      if (this.darkMode) {
        this.renderer.addClass(this.elRef.nativeElement, 'dark-mode');
      } else {
        this.renderer.removeClass(this.elRef.nativeElement, 'dark-mode');
      }
    }
  }
  
  

  private renderCustomPlot(): void {
    if (this.experiment && this.customPlotCode && this.elementId) {
      let errorOccurred = false;

      try {
        // Update data context
        this.plotDataService.experiments.forEach((experiment) => {
          if (!this.dataContext[experiment.name]) {
            this.dataContext[experiment.name] = {};
          }
          for (const [key, values] of Object.entries(experiment.data)) {
            if (!this.dataContext[experiment.name][key]) {
              this.dataContext[experiment.name][key] = [];
            }
            this.dataContext[experiment.name][key].push(...values);
          }
        });
        console.log("dataContext", this.dataContext)
  
        // Get the color for the experiment from the ColorService
        const experimentColor = this.colorService.getColor(this.experiment.name);
  
        // Create a function from the user's custom plot code
        const customPlotFunction = new Function(
          'dataContext',
          'Plotly',
          'elementId',
          'experimentColor',
          `
            const createPlot = () => {
              ${this.customPlotCode}
            };
            const { data, layout } = createPlot(dataContext);
            // Set the color for each trace
            data.forEach(trace => {
              if (!trace.marker) {
                trace.marker = {};
              }
              trace.marker.color = experimentColor;
            });
            Plotly.newPlot(elementId, data, layout);
          `
        );
  
        // Call the customPlotFunction with the data context, Plotly, elementId, and experimentColor
        customPlotFunction(this.dataContext, Plotly, this.elementId, experimentColor);
  
      } catch (error) {
        errorOccurred = true;
  
        if (error instanceof ReferenceError) {
          console.error('Error: Custom plot definition uses an unknown reference:', error);
        } else {
          console.error('Error while rendering the custom plot:', error);
        }
      } finally {
        if (errorOccurred) {
          const errorTrace: Partial<Plotly.ScatterData> = {
            x: [0],
            y: [0],
            mode: 'text',
            text: ['Error rendering plot'],
            type: 'scatter'
          };
  
          const errorLayout = {
            title: 'Error',
            xaxis: { visible: false },
            yaxis: { visible: false }
          };
  
          Plotly.newPlot(this.elementId, [errorTrace], errorLayout);
        }
      }
    }
  }
  
  
}

         
