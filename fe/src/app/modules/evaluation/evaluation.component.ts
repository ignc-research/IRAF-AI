import { Component, OnInit } from '@angular/core';
import { PlotDataService, Experiment } from './plot/plot-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from './plot/data-table/data-table.component';
import { Renderer2, RendererFactory2 } from '@angular/core';


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
  private renderer?: Renderer2;


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
        this.addedPlots.push({ type: 'custom', dataColumn: "", code: this.customPlotCode +  " return { data: data, layout: layout };" });
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
      var data = [
        {
          type: "isosurface",
          x: [0,0,0,0,1,1,1,1],
          y: [0,1,0,1,0,1,0,1],
          z: [1,1,0,0,1,1,0,0],
          value: [1,2,3,4,5,6,7,8],
          isomin: 2,
          isomax: 6,
          colorscale: "Reds"
        }
      ];
      
      var layout = {
        margin: {t:0, l:0, b:0},
        scene: {
          camera: {
            eye: {
              x: 1.88,
              y: -2.12,
              z: 0.96
            }
          }
        }
      };
      
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
  
}
