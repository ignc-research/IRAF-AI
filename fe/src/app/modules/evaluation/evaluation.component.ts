import { Component, OnInit } from '@angular/core';
import { PlotDataService, Experiment } from './plot/plot-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from './plot/data-table/data-table.component';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  firstExperiment: string | undefined;
  selectedPlot: string | undefined;
  selectedDataColumn: string = '';
  dataColumns: string[] = [];
  addedPlots: { type: string; dataColumn: string; code?: string }[] = [];
  private dataReadySubscription: Subscription | undefined;
  customPlotCode: string = '';

  constructor(private plotDataService: PlotDataService, public dialog: MatDialog) {
    this.selectedPlot = 'custom';

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
          const episodeData = experiment.data[0];
          if (episodeData) {
            this.dataColumns = Object.keys(episodeData.data);
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

  addPlot(): void {
    if (this.selectedPlot) {
      if (this.selectedPlot === 'custom') {
        console.log('Adding custom plot:', this.selectedDataColumn, this.customPlotCode);
        this.addedPlots.push({ type: 'custom', dataColumn: "", code: this.customPlotCode });
      } else if (this.selectedDataColumn) {
        console.log('Adding plot:', this.selectedDataColumn);
        this.addedPlots.push({ type: this.selectedPlot, dataColumn: this.selectedDataColumn });
      }
    }
  }
  

  removePlot(index: number): void {
    this.addedPlots.splice(index, 1);
  }

  private setDefaultCustomPlotCode(): void {
    this.customPlotCode = `
      const trace = {
        x: dataContext['${this.dataColumns[7]}'],
        y: dataContext['${this.dataColumns[8]}'],
        mode: 'markers',
        type: 'line'
      };
      return { data: [trace], layout: {} };
    `;
  }

  openDataTable(): void {
    if (this.firstExperiment) {
      const experiment: Experiment | undefined = this.plotDataService.experiments.find(
        (exp) => exp.name === this.firstExperiment
      );
      if (experiment) {
        this.dialog.open(DataTableComponent, {
          data: { experiment: experiment },
          maxWidth: '100%',
          maxHeight: '100%',
          height: '92%',
          width: '92%',
        });
      }
    }
  }

  updateCustomPlotCode(): void {
    this.addedPlots.forEach((plot, index) => {
      if (plot.type === 'custom') {
        this.addedPlots[index] = {
          ...plot,
          code: this.customPlotCode,
        };
      }
    });
  }
  
}
