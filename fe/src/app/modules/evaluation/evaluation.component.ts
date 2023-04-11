import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlotDataService, Experiment } from './plot/plot-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from './plot/data-table/data-table.component';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import nj from '@d4c/numjs/build/module/numjs.min.js';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {

  @Input() experiment: Experiment | undefined;
  @ViewChild('variableEditor') variableEditor!: ElementRef;

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
  isDarkModeEnabled = false;
  globalVariableValues: { [key: string]: any } = {};


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
      // Extract variable name from definition
      const variableNameMatch = this.variableDefinition.match(/^(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/);
      if (variableNameMatch && variableNameMatch[1]) {
        const variableName = variableNameMatch[1];
  
        // Check if the variable is a function declaration
        const functionDeclarationMatch = this.variableDefinition.match(/\s*=\s*\(?\s*function\s*\(\s*.*\s*\)\s*{|\s*=\s*\(\s*.*\s*\)\s*=>\s*{/);
        if (functionDeclarationMatch) {
          this.globalVariables[variableName] = this.variableDefinition;
  
          // Create a function that wraps the function definition and executes it with the nj library available
          const wrappedFunction = new Function(`const nj = arguments[0]; ${this.variableDefinition} return ${variableName}.apply(null, [nj].concat(Array.from(arguments).slice(1)));`);
  
          // Execute the custom function after adding it and store the result in globalVariableValues
          const result = wrappedFunction(nj); // Pass nj as the first argument
          this.globalVariableValues[variableName] = result;
          console.log(`Result of custom function '${variableName}':`, result);
        } else {
          this.globalVariables[variableName] = this.variableDefinition;
          // Evaluate the variable and store its value
          const evalVariable = new Function(`${this.variableDefinition} return ${variableName};`);
          this.globalVariableValues[variableName] = evalVariable();
        }
      } else {
        throw new Error("Variable name not found or already declared");
      }
  
      this.variableDefinition = '';
  
      // Emit an event when a new global variable is added
      this.globalVariableAdded.next();
    } catch (error) {
      console.error('Error evaluating variable:', error);
      alert('Error evaluating variable: ' + error);
    }
  }
  


  
  

  

  

  openVariableEditor(variableName: string): void {
    this.variableDefinition = this.globalVariables[variableName];

    const variableDiv = document.querySelector('.variable-div');
    if (variableDiv) {
      const rect = variableDiv.getBoundingClientRect();

      this.variableEditor.nativeElement.style.position = 'absolute';
      this.variableEditor.nativeElement.style.left = rect.left + 'px';
      this.variableEditor.nativeElement.style.top = rect.bottom + 'px';
      this.variableEditor.nativeElement.style.display = 'block';
    }
  }

  closeVariableEditor(): void {
    this.variableEditor.nativeElement.style.display = 'none';
  }

  saveVariable(variableName: string): void {
    this.globalVariables[variableName] = this.variableDefinition;
    this.closeVariableEditor();
  }

  addPlot(): void {
    if (this.selectedPlot) {
      if (this.selectedPlot === 'custom') {
        // Check for variables in the customPlotCode and add their values
        let globalVariablesValuesCode = '';
        for (const [variableName, variableValue] of Object.entries(this.globalVariableValues)) {
          if (this.customPlotCode.includes(variableName)) {
            globalVariablesValuesCode += `const ${variableName} = ${JSON.stringify(variableValue)};\n`;
          }
        }
  
        const customPlotWithVariables = `
          ${globalVariablesValuesCode}
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
    const velocityData = dataContext['velocity_link_7_ur5_1'];

    const x = positionData.map((values) => values[0]);
    const y = positionData.map((values) => values[1]);
    const z = positionData.map((values) => values[2]);

    const velocityMagnitude = velocityData.map((values) => {
      const vx = values[0];
      const vy = values[1];
      const vz = values[2];
      return Math.sqrt(vx * vx + vy * vy + vz * vz);
    });

    const trace = {
      x: z, // Swap x and z axes
      y: y,
      z: x, // Swap x and z axes
      mode: 'markers',
      marker: {
        size: 2,
        color: velocityMagnitude,
        colorscale: 'Viridis',
        opacity: 0.8,
        showscale: true,
      },
      type: 'scatter3d',
    };

    const layout = {
      title: '3D Scatter Plot of Position with Velocity Magnitude',
      scene: {
        xaxis: { title: 'Z Axis' }, // Update axis labels
        yaxis: { title: 'Y Axis' },
        zaxis: { title: 'X Axis' }, // Update axis labels
      },
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
        this.isDarkModeEnabled = false;
      } else {
        this.renderer.addClass(body, 'dark-mode');
        this.isDarkModeEnabled = true;
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
