import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PlotDataService, Experiment } from './plot/plot-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from './plot/data-table/data-table.component';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import nj from '@d4c/numjs/build/module/numjs.min.js';
import { ColorService } from './plot/color.service';

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
  overwriteMode: boolean = false;
  dataContext: { [key: string]: { [key: string]: any[] } } = {};
  
  



  constructor(private plotDataService: PlotDataService, public dialog: MatDialog, rendererFactory: RendererFactory2, private colorService: ColorService) {
    this.selectedPlot = 'custom';
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  
  

  ngOnInit(): void {
    this.dataReadySubscription = this.plotDataService.onDataReady.subscribe(() => {
      const experimentNames = this.plotDataService.getExperimentNames();
      this.firstExperiment = experimentNames.length > 0 ? experimentNames[0] : undefined;

      if (this.firstExperiment) {
        this.experiment = this.plotDataService.experiments.find(
          (exp) => exp.name === this.firstExperiment
        );
        if (this.experiment) {
          if (this.experiment) {
            this.dataColumns = Object.keys(this.experiment.data);
            if (this.dataColumns.length > 0) {
              this.setDefaultCustomPlotCode();
            }
          }
        }
      }

      // initialize dataContext
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


      // addVariable() throws error while trying to add default custom functions
      //this.addDefaultCustomFunctions();
      //console.log("added default custom functions")


    });
  }

  ngOnDestroy(): void {
    if (this.dataReadySubscription) {
      this.dataReadySubscription.unsubscribe();
    }
  }

  addDefaultCustomFunctions(): void {
    this.variableDefinition = `
    const avgTrj = (experimentName: string, field: string) => {
      const positionData = dataContext[experimentName][field];
    
      function getAverageXyz(trajectories: { x: number[]; y: number[]; z: number[] }[]) {
        const minCount = Math.min(...trajectories.map((line) => line.x.length));
    
        trajectories.forEach((line) => {
          while (line.x.length - minCount > 0) {
            const randomIndex = Math.round(Math.random() * 2 + 1);
            line.x.splice(randomIndex, 1);
            line.y.splice(randomIndex, 1);
            line.z.splice(randomIndex, 1);
          }
        });
    
        const avgXValues = nj.zeros(minCount).tolist();
        const avgYValues = nj.zeros(minCount).tolist();
        const avgZValues = nj.zeros(minCount).tolist();
    
        trajectories.forEach((line) => {
          for (let i = 0; i < minCount; i++) {
            avgXValues[i] += line.x[i];
            avgYValues[i] += line.y[i];
            avgZValues[i] += line.z[i];
          }
        });
    
        for (let i = 0; i < minCount; i++) {
          avgXValues[i] /= trajectories.length;
          avgYValues[i] /= trajectories.length;
          avgZValues[i] /= trajectories.length;
        }
    
        return {
          x: avgXValues,
          y: avgYValues,
          z: avgZValues,
        };
      }
    
      const trajectories = positionData.map((values: number[][]) => ({
        x: values.map((value) => value[0]),
        y: values.map((value) => value[1]),
        z: values.map((value) => value[2]),
      }));
    
      const avgTrajectory = getAverageXyz(trajectories);
    
      return avgTrajectory;
    }
    `;
    this.addVariable();
    this.variableDefinition = '';
  }
  
  refreshPlot(index: number): void {
    const plot = this.addedPlots[index];
    if (plot.type === 'custom' && plot.code) {  
      this.removePlot(index);
      console.log("deleted plot at: ", index)
  
      this.customPlotCode = plot.code;
  
      this.addPlot();
    }
  }
  
  addVariable(): void {
    try {
      // Extract variable name from definition
      const variableNameMatch = this.variableDefinition.match(/^(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/);
      if (variableNameMatch && variableNameMatch[1]) {
        const variableName = variableNameMatch[1];
  
        // Check if the variable already exists
        if (this.globalVariables.hasOwnProperty(variableName) && !this.overwriteMode) {
          this.overwriteMode = true;
          return;
        }
  
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

        // Prepare experiment colors
        const experimentColors: { [key: string]: string } = {};
        this.plotDataService.experiments.forEach((experiment) => {
          experimentColors[experiment.name] = this.colorService.generateColor(experiment.name);
        });
  
        // Prepare a code block with custom variables
        let customVariablesCode = '';
        for (const [existingVarName, existingVarValue] of Object.entries(this.globalVariableValues)) {
          customVariablesCode += `const ${existingVarName} = ${JSON.stringify(existingVarValue)};\n`;
        }
  
        // Check if the variable is a function declaration
        const functionDeclarationMatch = this.variableDefinition.match(/\s*=\s*\(?\s*function\s*\(\s*.*\s*\)\s*{|\s*=\s*\(\s*.*\s*\)\s*=>\s*{/);
        if (functionDeclarationMatch) {
          this.globalVariables[variableName] = this.variableDefinition;
  
          // Create a function that wraps the function definition and executes it with the nj library and custom variables available
          const wrappedFunction = new Function(`const nj = arguments[0]; const dataContext = arguments[1]; ${customVariablesCode} ${this.variableDefinition} return ${variableName}.apply(null, [nj, dataContext].concat(Array.from(arguments).slice(2)));`);
  
          // Execute the custom function after adding it and store the result in globalVariableValues
          const result = wrappedFunction(nj, this.dataContext, experimentColors); // Pass nj as the first argument and dataContext as the second argument and experimentColors as the third argument
          this.globalVariableValues[variableName] = result;
          console.log(`Result of custom function '${variableName}':`, result);
        } else {
          this.globalVariables[variableName] = this.variableDefinition;
          // Evaluate the variable and store its value
          const evalVariable = new Function(`const nj = arguments[0]; const dataContext = arguments[1]; ${customVariablesCode} ${this.variableDefinition} return ${variableName};`);
          this.globalVariableValues[variableName] = evalVariable(nj, this.dataContext);
        }
      } else {
        throw new Error("Variable name not found");
      }
  
      this.variableDefinition = '';
  
      // Emit an event when a new global variable is added
      this.globalVariableAdded.next();
    } catch (error) {
      console.error('Error evaluating variable:', error);
      //alert('Error evaluating variable: ' + error);
    }
  }
  
  
  overwriteVariable(): void {
    // Extract variable name from definition
    const variableNameMatch = this.variableDefinition.match(/^(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=/);
    if (variableNameMatch && variableNameMatch[1]) {
      const variableName = variableNameMatch[1];
      
      // Remove the old function or variable with the same name
      delete this.globalVariables[variableName];
    }
  
    this.addVariable();
    this.overwriteMode = false;
  }
  
  
  
  cancelOverwrite(): void {
    this.overwriteMode = false;
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
    // Check for variables in the customPlotCode and add their values
    let globalVariablesValuesCode = '';
    for (const [variableName, variableValue] of Object.entries(this.globalVariableValues)) {
      if (this.customPlotCode.includes(variableName)) {
        globalVariablesValuesCode += `const ${variableName} = ${JSON.stringify(variableValue)};\n`;
      }
    }

    const customPlotStartIndex = this.customPlotCode.indexOf('//start')
    const customPlotEndIndex = this.customPlotCode.indexOf('//end')

    const customPlotWithVariables = `
      ${globalVariablesValuesCode}
      ${this.customPlotCode.slice(0, customPlotStartIndex)}
      ${this.customPlotCode.slice(customPlotStartIndex, customPlotEndIndex)}
    `;

    //console.log('Adding custom plot:', customPlotWithVariables);
    this.addedPlots.push({ type: 'custom', dataColumn: "", code: customPlotWithVariables });

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
      //start
      const positionData = dataContext['example_experiment']['position_link_7_ur5_1'];
      const velocityData = dataContext['example_experiment']['velocity_link_7_ur5_1'];
  
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
        x: z, 
        y: y,
        z: x, 
        mode: 'markers',
        marker: {
          size: 2,
          color: "Veridis",
          opacity: 0.8,
          showscale: true,
        },
        type: 'scatter3d',
      };
  
      const layout = {
        title: '3D Scatter Plot of Position with Velocity Magnitude',
        scene: {
          xaxis: { title: 'Z Axis' }, 
          yaxis: { title: 'Y Axis' },
          zaxis: { title: 'X Axis' }, 
        },
      };
  
      const data = [trace];
  
      return { data: data, layout: layout };
      //end
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
