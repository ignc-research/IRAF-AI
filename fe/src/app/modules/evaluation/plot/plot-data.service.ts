import { EventEmitter, Injectable } from '@angular/core';
import {Data} from "plotly.js-dist-min";
import * as d3 from "d3";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlotDataService {

  onDataReady: EventEmitter<void> = new EventEmitter();
  
  experiments: Experiment[] = [];

  constructor() {
    this.parseCsv();
  }

  parseCsv(): void {
    // Load CSV file
    d3.csv("http://localhost:4200/assets/test_csv.csv").then((parsedData) => {
      // Preprocess and process the loaded data
      const preprocessedData = this.preprocessData(parsedData);
      this.processData(preprocessedData);

      console.log("Experiments:", this.experiments);

      // Add this line to emit the event when data is ready
      this.onDataReady.emit();
    });
  }

  getExperimentNames(): string[] {
    return this.experiments.map((exp) => exp.name);
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
            .split(/\s+/) // Use a regex to split on one or more spaces
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
      ? Object.keys(this.experiments[0].data[0]?.data ?? {})
      : [];
  }

  processData(preprocessedData: any[]): void {
    const experiment: Experiment = {
      name: 'Sample Experiment',
      data: [],
      episodes: {},
    };
  
    // Extract the column names
    const columnNames = preprocessedData[0] ? Object.keys(preprocessedData[0]).filter((columnName) => columnName !== 'episode') : [];
  
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
        }
  
        experiment.data.push(experimentData);
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

// Define the necessary types
export type Experiment = {
  name: string;
  data: ExperimentData[];
  episodes: { [episode: number]: ExperimentData };
};

type ExperimentData = {
  episode: number;
  data: { [key: string]: (number | number[])[] };
};
