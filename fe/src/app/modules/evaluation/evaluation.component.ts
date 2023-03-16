import { Component, OnInit } from '@angular/core';
import { PlotDataService, Experiment } from './plot/plot-data.service';
import { Subscription } from 'rxjs';

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
  addedPlots: { type: string; dataColumn: string }[] = []; // Make dataColumn required
  private dataReadySubscription: Subscription | undefined;

  constructor(private plotDataService: PlotDataService) {}

  ngOnInit(): void {
    this.dataReadySubscription = this.plotDataService.onDataReady.subscribe(() => {
      const experimentNames = this.plotDataService.getExperimentNames();
      this.firstExperiment = experimentNames.length > 0 ? experimentNames[0] : undefined;

      // Update dataColumns when onDataReady is triggered
      if (this.firstExperiment) {
        const experiment: Experiment | undefined = this.plotDataService.experiments.find(
          (exp) => exp.name === this.firstExperiment
        );
        if (experiment) {
          const episodeData = experiment.data[0];
          if (episodeData) {
            this.dataColumns = Object.keys(episodeData.data);
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
    if (this.selectedPlot && this.selectedDataColumn) {
      console.log('Adding plot:', this.selectedDataColumn);
      this.addedPlots.push({ type: this.selectedPlot, dataColumn: this.selectedDataColumn });
    }
  }
  

  removePlot(index: number): void {
    this.addedPlots.splice(index, 1);
  }
}
