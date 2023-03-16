import { Component, OnInit } from '@angular/core';
import { PlotDataService } from './plot/plot-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  firstExperiment: string | undefined;
  selectedPlot: string | undefined;
  addedPlots: { type: string }[] = [];
  private dataReadySubscription: Subscription | undefined;

  constructor(private plotDataService: PlotDataService) {}

  ngOnInit(): void {
    this.dataReadySubscription = this.plotDataService.onDataReady.subscribe(() => {
      const experimentNames = this.plotDataService.getExperimentNames();
      this.firstExperiment = experimentNames.length > 0 ? experimentNames[0] : undefined;
    });
  }

  ngOnDestroy(): void {
    if (this.dataReadySubscription) {
      this.dataReadySubscription.unsubscribe();
    }
  }

  addPlot(): void {
    if (this.selectedPlot) {
      this.addedPlots.push({ type: this.selectedPlot });
    }
  }

  removePlot(index: number): void {
    this.addedPlots.splice(index, 1);
  }
}
