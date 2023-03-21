import { Injectable } from '@angular/core';
import {Data} from "plotly.js-dist-min";
import * as d3 from "d3";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlotDataService {



  categoryChanged = new Subject<Category>();

  categories: Category[] = [
    {
      name: 'RRT',
      color: '#0000ff',
      showAvg: true,
      lineType: 'dashdot'
    },
    {
      name: 'DRL',
      color: '#ff00ff',
      showAvg: true,
      lineType: 'dashdot'
    },
    {
      name: 'NC-RRT',
      color: '#00ff00',
      showAvg: true,
      lineType: 'dashdot'
    },
    {
      name: 'prm',
      color: '#ff0000',
      showAvg: true,
      lineType: 'dashdot'
    }
  ];
  experiments: Experiment[] = [];

  constructor() {

  }

  mapTrajectoryData = (data: d3.DSVRowArray<string>) => {
    return {
      x: data.map(x => x[data.columns[1]] as any),
      y: data.map(x => x[data.columns[2]] as any),
      z: data.map(x => x[data.columns[3]] as any)
    }
  }
  mapTimestampData = (data: d3.DSVRowArray<string>) => data.map(x => +x[data.columns[0]]! as any);

  async loadExperiment(name: string) {
    const existingExperiment = this.experiments.find(x => x.name);
    if (existingExperiment) {
      return existingExperiment;
    }

    const newExperiment: Experiment = {
      name: name,
      data: []
    };

    // ToDo: Kategorien sin abhängig vom experiment, daher muss das iwie dynamisch passieren
    await Promise.all(this.categories.map(async(category) => {
      const type = category.name;
      const trajectories: Data[] = [];
      const executionTime: number[] = [];
      for (let i = 1; i < 31; i++) {
        const remoteData = await d3.dsv(" ", `http://localhost:4200/assets/${name}/${type}/${i}.txt`);
        trajectories.push(this.mapTrajectoryData(remoteData));
        const timestamps = this.mapTimestampData(remoteData);

        executionTime.push(timestamps[timestamps.length - 1] - timestamps[0]);
      }

      const avgTrajectory = this.getAverageXyz(trajectories);
      newExperiment.data.push({
        trajectories,
        category,
        avgTrajectory,
        avgPathLength: this.getAvgPathLength(trajectories),
        avgExecutionTime: this.getAvg(executionTime)
      });
    }));

    this.experiments.push(newExperiment);
    return newExperiment;
  }

  getAvgPathLength(trajectories: Data[]) {
    return this.getAvg(trajectories.map(x => this.getPathLength(x)));
  }

  getPathLength(data: any) {
    let length = 0;
    for (let i = 1; i < data.x.length; i++) {
      length += Math.sqrt(
        Math.pow(data.x[i] - data.x[i - 1], 2) +
        Math.pow(data.y[i] - data.y[i - 1], 2) +
        Math.pow(data.z[i] - data.z[i - 1], 2)
        );
    }
    return length;
  }

  getAvg(data: number[]) {
    const sum = data.reduce((a, b) => a + b, 0);
    const avg = (sum / data.length) || 0;
    return avg;
  }

  getAverageXyz(data: Data[]): Data {
    const minCount = Math.min(...data.map((line: any) => line.x.length));

    data.forEach((line: any) => {
      while(line.x.length - minCount > 0) {
        const randomIndex = Math.round(Math.random() * 2 + 1);
        line.x.splice(randomIndex, 1);
        line.y.splice(randomIndex, 1);
        line.z.splice(randomIndex, 1);
      }
    });

    let avgXValues = [];
    let avgYValues = [];
    let avgZValues = [];
    for (let i = 0; i < minCount; i++) {
      let avgX = 0;
      let avgY = 0;
      let avgZ = 0;
      data.forEach((line: any) => {
        avgX += +line.x[i];
        avgY += +line.y[i];
        avgZ += +line.z[i];
      })
      avgXValues.push(avgX / data.length);
      avgYValues.push(avgY / data.length);
      avgZValues.push(avgZ / data.length);
    }

    return {
      x: avgXValues,
      y: avgYValues,
      z: avgZValues
    }
  }

  updateCategory(category: string, color?: string, lineType?: any, showAvg?: boolean) {
    const cat = this.categories.find(x => x.name == category);
    if (cat) {
       cat.color = color ? color : cat.color;
       cat.lineType = lineType ? lineType : cat.lineType;
       cat.showAvg = showAvg !== undefined ? showAvg : cat.showAvg;
       this.categoryChanged.next(cat);
    }
  }
}

export type Experiment = {
  name: string;
  data: ExperimentData[]
}

export type Category = {
  name: string;
  color: string;

  showAvg: boolean;

  lineType: 'solid' | 'dashdot' | 'dot' | 'dash' | 'none';
}

export type ExperimentData = {
  category: Category;
  trajectories: Data[];

  avgTrajectory: Data;
  avgPathLength: number;

  avgExecutionTime: number;
}
