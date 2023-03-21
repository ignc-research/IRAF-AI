import { Component, Input, OnInit } from '@angular/core';
import { PlotDataService, Experiment } from './plot/plot-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from './plot/data-table/data-table.component';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';




@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {

  @Input() experiment: Experiment | undefined;

  
  firstExperiment: string | undefined;
  selectedPlot: string | undefined;
  selectedDataColumn: string = '';
  dataColumns: string[] = [];
  addedPlots: { type: string; dataColumn: string; code?: string }[] = [];
  private dataReadySubscription: Subscription | undefined;
  customPlotCode: string = '';
  private renderer?: Renderer2;
  drawerOpen: boolean = true;
  globalVariables: { [key: string]: any } = {};
  variableDefinition: string = '';
  globalVariableAdded: Subject<void> = new Subject<void>();




  constructor(private plotDataService: PlotDataService, public dialog: MatDialog, rendererFactory: RendererFactory2) {
    this.selectedPlot = 'custom';
    this.renderer = rendererFactory.createRenderer(null, null);

  }

  ngOnInit(): void {
    this.dataReadySubscription = this.plotDataService.onDataReady.subscribe(() => {
      const experimentNames = this.plotDataService.getExperimentNames();
      this.firstExperiment = experimentNames.length > 0 ? experimentNames[0] : undefined;
  
      if (this.firstExperiment) {
        const experiment: Experiment | undefined = this.plotDataService.experiments.find(
          (exp) => exp.name === this.firstExperiment
        );
        if (experiment) {
          if (experiment) {
            this.dataColumns = Object.keys(experiment.data);
            if (this.dataColumns.length > 0) {
              this.setDefaultCustomPlotCode();
            }
          }
        }
      }
    });
  }
  

  ngOnDestroy(): void {
    if (this.dataReadySubscription) {
      this.dataReadySubscription.unsubscribe();
    }
  }

  addVariable(): void {
    try {
      const dataContext = this.experiment ? this.experiment.data : {};
      
      const variableFunction = (context: any) => {
        console.log('Evaluating variable:', eval(this.variableDefinition));
        return eval(this.variableDefinition);
      };
      const result = variableFunction(dataContext);
  
      // Extract variable name from definition
      const variableNameMatch = this.variableDefinition.match(/^(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/);
      if (variableNameMatch && variableNameMatch[1]) {
        const variableName = variableNameMatch[1];
        this.globalVariables[variableName] = result;
  
        // Add the variable to the window object (global namespace)
        (window as any)[variableName] = result;
      } else {
        throw new Error("Variable name not found");
      }
  
      this.variableDefinition = '';
  
      // Emit an event when a new global variable is added
      this.globalVariableAdded.next();
    } catch (error) {
      console.error('Error evaluating variable:', error);
      alert('Error evaluating variable: ' + error);
    }
  }
  
  
  
  
  

  addPlot(): void {
    if (this.selectedPlot) {
      if (this.selectedPlot === 'custom') {
        // Execute global variables
        let globalVariablesCode = '';
        for (const [variableName, variableValue] of Object.entries(this.globalVariables)) {
          globalVariablesCode += `const ${variableName} = ${JSON.stringify(variableValue)};`;
        }
  
        const customPlotWithVariables = `
          ${globalVariablesCode}
          ${this.customPlotCode}
          return { data: data, layout: layout };
        `;
  
        console.log('Adding custom plot:', this.selectedDataColumn, customPlotWithVariables);
        this.addedPlots.push({ type: 'custom', dataColumn: "", code: customPlotWithVariables });
      } else if (this.selectedDataColumn) {
        console.log('Adding plot:', this.selectedDataColumn);
        this.addedPlots.push({ type: this.selectedPlot, dataColumn: this.selectedDataColumn });
      }
    }
  }
  
  

  onFileInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.plotDataService.importCsvFile(file);
    }
  }
  
  getImportedCsvFileNames(): string[] {
    return Object.keys(this.plotDataService.importedCsvFiles);
  }
  
  
  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  removePlot(index: number): void {
    this.addedPlots.splice(index, 1);
  }

  private setDefaultCustomPlotCode(): void {
    this.customPlotCode = `
      
    const positionData = dataContext['position_link_7_ur5_1'];

    const x = positionData.map((values) => values[0]);
    const y = positionData.map((values) => values[1]);
    const z = positionData.map((values) => values[2]);
    
    const trace = {
      x: x,
      y: y,
      z: z,
      mode: 'lines+markers',
      marker: {
        size: 8,
        color: z,
        colorscale: 'Viridis',
        opacity: 0.8
      },
      type: 'scatter3d'
    };
    
    const layout = {
      scene: {
        xaxis: { title: 'X Axis' },
        yaxis: { title: 'Y Axis' },
        zaxis: { title: 'Z Axis' }
      }
    };
    
    const data = [trace];
    
              return { data: data, layout: layout };
            
      
    `;
  }

  toggleDarkMode(): void {
    const body = document.body;
    if (this.renderer != undefined) {
      if (body.classList.contains('dark-mode')) {
        this.renderer.removeClass(body, 'dark-mode');
      } else {
        this.renderer.addClass(body, 'dark-mode');
      }
    }
  }

  getExperiments(): Experiment[] {
    return this.plotDataService.experiments;
  }

  openDataTable(experiment: Experiment): void {
    this.dialog.open(DataTableComponent, {
      data: { experiment: experiment },
      maxWidth: '100%',
      maxHeight: '100%',
      height: '92%',
      width: '92%',
    });
  }
  
  
  
}
