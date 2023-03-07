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
      color: '#0000ff'
    },
    {
      name: 'DRL',
      color: '#ff00ff'
    },
    {
      name: 'NC-RRT',
      color: '#00ff00'
    },
    {
      name: 'prm',
      color: '#ff0000'
    }
  ];
  experiments: Experiment[] = [];

  constructor() {

  }

  mapRemoteData = (data: d3.DSVRowArray<string>) => {
    return {
      x: data.map(x => x[data.columns[1]] as any),
      y: data.map(x => x[data.columns[2]] as any),
      z: data.map(x => x[data.columns[3]] as any)
    }
  }

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
      for (let i = 1; i < 31; i++) {
        const remoteData = await d3.dsv(" ", `http://localhost:4200/assets/${name}/${type}/${i}.txt`);
        const mappedData = this.mapRemoteData(remoteData)
        trajectories.push(mappedData);
      }
      const avgTrajectory = this.getAverageXyz(trajectories);
      newExperiment.data.push({
        trajectories,
        category,
        avgTrajectory,
        avgPathLength: this.getAvgPathLength(trajectories)
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

  updateColor(category: string, color: string) {
    const cat = this.categories.find(x => x.name == category);
    if (cat) {
       cat.color = color;
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
}

export type ExperimentData = {
  category: Category;
  trajectories: Data[];
  avgTrajectory: Data;
  avgPathLength: number;
}
