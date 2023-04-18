import { EventEmitter, Injectable } from '@angular/core';
import { Data } from 'plotly.js-dist-min';
import * as d3 from 'd3';
import { BehaviorSubject, Subject } from 'rxjs';
import { ColorService } from './color.service';

@Injectable({
  providedIn: 'root',
})
export class PlotDataService {
  onDataReady: EventEmitter<void> = new EventEmitter();

  experiments: Experiment[] = [];
  importedCsvFiles: { [key: string]: string } = {};

  constructor(private colorService: ColorService) {
    this.parseCsv();
  }

  parseCsv(csvData?: string, csvFileName?: string): void {
    // Load CSV file
    const csvUrl = csvData
      ? URL.createObjectURL(new Blob([csvData], { type: 'text/csv' }))
      : 'http://localhost:4200/assets/episode_300.csv';

    d3.csv(csvUrl).then((parsedData) => {
      // Preprocess and process the loaded data
      const preprocessedData = this.preprocessData(parsedData);
      this.processData(preprocessedData, csvFileName);

      console.log('Experiments:', this.experiments);

      // Add this line to emit the event when data is ready
      this.onDataReady.emit();
    });
  }

  getExperimentNames(): string[] {
    return this.experiments.map((exp) => exp.name);
  }

  importCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      this.importedCsvFiles[file.name] = csvData;
      this.parseCsv(csvData, file.name);
    };
    reader.readAsText(file);
  }

  preprocessData(parsedData: d3.DSVRowArray<string>): any[] {
    const columnNames = parsedData.columns;

    const data: any[] = parsedData.map((row) => {
      const rowData: { [key: string]: any } = {};

      columnNames.forEach((columnName) => {
        const cell = row[columnName] ?? '';

        if (cell.startsWith('[') && cell.endsWith(']')) {
          rowData[columnName] = cell
            .replace(/\s+\]/g, ']') // Fix faulty spaces before closing bracket
            .slice(1, -1)
            .split(/\s+/) // Use a regex to split on spaces with optional surrounding spaces
            .map((value) => parseFloat(value));
        } else {
          rowData[columnName] = parseFloat(cell);
        }
      });

      return rowData;
    });

    return data;
  }

  getDataColumns(): string[] {
    return this.experiments.length > 0
      ? Object.keys(this.experiments[0].data)
      : [];
  }

  processData(preprocessedData: any[], csvFileName?: string): void {
    const experiment: Experiment = {
      name: csvFileName ?? 'example_experiment',
      data: {},
      episodes: {},
      color: this.colorService.generateColor(csvFileName ?? 'example_experiment'),
    };

    // Extract the column names
    const columnNames = preprocessedData[0]
      ? Object.keys(preprocessedData[0]).filter((columnName) => columnName !== 'episode')
      : [];

    // Group data by episode
    const groupedData = this.groupDataByEpisode(preprocessedData);

    // Process and store grouped data
    for (const [episodeStr, episodeData] of Object.entries(groupedData)) {
      const episode = parseInt(episodeStr, 10);
      if (!isNaN(episode)) {
        const experimentData: ExperimentData = {
          episode: episode,
          data: {},
        };
        for (const columnName of columnNames) {
          experimentData.data[columnName] = episodeData.map((row) => {
            const cellValue = row[columnName];
            return Array.isArray(cellValue) ? cellValue : parseFloat(cellValue ?? 'NaN');
          });
          // Concatenate the episode data to the experiment.data[columnName] array
          if (!experiment.data[columnName as string]) {
            experiment.data[columnName as string] = [];
          }
          experiment.data[columnName as string] = experiment.data[columnName as string].concat(experimentData.data[columnName]);
        }

        experiment.episodes[episode] = experimentData;
      }
    }
    this.experiments.push(experiment);
  }

  
  

  groupDataByEpisode(data: any[]): { [episode: string]: any[] } {
    const groupedData: { [episode: string]: any[] } = {};

    data.forEach((row) => {
      const episode = row['episode'];
      if (episode) {
        if (!groupedData[episode]) {
          groupedData[episode] = [];
        }
        groupedData[episode].push(row);
      }
    });

    return groupedData;
  }
}

export type Experiment = {
  name: string;
  data: { [key: string]: (number | number[])[] };
  episodes: { [episode: number]: ExperimentData };
  color: string;

};

type ExperimentData = {
  episode: number;
  data: { [key: string]: (number | number[])[] };
};

    