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
  episode: number[] = [];
  is_success: boolean[] = [];
  step: number[] = [];
  success_rate: number[] = [];
  out_of_bounds_rate: number[] = [];
  timeout_rate: number[] = [];
  collision_rate: number[] = [];
  sim_time: number[] = [];
  cpu_time: number[] = [];
  action_cpu_time_ur5_1: number[] = [];
  joints_angles_ur5_1: number[][] = [];
  joints_velocities_ur5_1: number[][] = [];
  joints_sensor_cpu_time_ur5_1: number[] = [];
  position_link_7_ur5_1: number[][] = [];
  velocity_link_7_ur5_1: number[][] = [];
  rotation_link_7_ur5_1: number[][] = [];
  position_rotation_sensor_cpu_time_ur5_1: number[] = [];
  shaking_ur5_1: number[] = [];
  reward_ur5_1: number[] = [];
  distance_ur5_1: number[] = [];
  distance_threshold_ur5_1: number[] = [];

  constructor() {
    this.loadExperiment("http://localhost:4200/assets/test_csv.csv").then((result) => {
      //save result to experiment array
      this.experiments.push(result);
      console.log(this.experiments);
  });
  }

  async loadCsvData() {
    let data;

    // Check if data is in local storage
    if (localStorage.getItem('episode')) {

      // Check if data is in local storage
      let episodeString = localStorage.getItem('episode');
      if (episodeString !== null) {
          this.episode = JSON.parse(episodeString);
      }

      let isSuccessString = localStorage.getItem('is_success');
      if (isSuccessString !== null) {
          this.is_success = JSON.parse(isSuccessString);
      }

      let stepString = localStorage.getItem('step');
      if (stepString !== null) {
          this.step = JSON.parse(stepString);
      }

      let successRateString = localStorage.getItem('success_rate');
      if (successRateString !== null) {
          this.success_rate = JSON.parse(successRateString);
      }

      let outOfBoundsRateString = localStorage.getItem('out_of_bounds_rate');
      if (outOfBoundsRateString !== null) {
          this.out_of_bounds_rate = JSON.parse(outOfBoundsRateString);
      }

      let timeoutRateString = localStorage.getItem('timeout_rate');
      if (timeoutRateString !== null) {
          this.timeout_rate = JSON.parse(timeoutRateString);
      }

      let collisionRateString = localStorage.getItem('collision_rate');
      if (collisionRateString !== null) {
          this.collision_rate = JSON.parse(collisionRateString);
      }

      let simTimeString = localStorage.getItem('sim_time');
      if (simTimeString !== null) {
          this.sim_time = JSON.parse(simTimeString);
      }

      let cpuTimeString = localStorage.getItem('cpu_time');
      if (cpuTimeString !== null) {
          this.cpu_time = JSON.parse(cpuTimeString);
      }

      let actionCpuTimeString = localStorage.getItem('action_cpu_time_ur5_1');
      if (actionCpuTimeString !== null) {
          this.action_cpu_time_ur5_1 = JSON.parse(actionCpuTimeString);
      }

      let jointsAnglesString = localStorage.getItem('joints_angles_ur5_1');
      if (jointsAnglesString !== null) {
          this.joints_angles_ur5_1 = JSON.parse(jointsAnglesString);
      }

      let jointsVelocitiesString = localStorage.getItem('joints_velocities_ur5_1');
      if (jointsVelocitiesString !== null) {
          this.joints_velocities_ur5_1 = JSON.parse(jointsVelocitiesString);
      }

      let jointsSensorCpuTimeString = localStorage.getItem('joints_sensor_cpu_time_ur5_1');
      if (jointsSensorCpuTimeString !== null) {
          this.joints_sensor_cpu_time_ur5_1 = JSON.parse(jointsSensorCpuTimeString);
      }

      let positionLink7String = localStorage.getItem('position_link_7_ur5_1');
      if (positionLink7String !== null) {
          this.position_link_7_ur5_1 = JSON.parse(positionLink7String);
      }

      let velocityLink7String = localStorage.getItem('velocity_link_7_ur5_1');
      if (velocityLink7String !== null) {
          this.velocity_link_7_ur5_1 = JSON.parse(velocityLink7String);
      }

      let rotationLink7String = localStorage.getItem('rotation_link_7_ur5_1');
      if (rotationLink7String !== null) {
          this.rotation_link_7_ur5_1 = JSON.parse(rotationLink7String);
      }

      let positionRotationSensorCpuTimeString = localStorage.getItem('position_rotation_sensor_cpu_time_ur5_1');
      if (positionRotationSensorCpuTimeString !== null) {
          this.position_rotation_sensor_cpu_time_ur5_1 = JSON.parse(positionRotationSensorCpuTimeString);
      }

      let shakingString = localStorage.getItem('shaking_ur5_1');
      if (shakingString !== null) {
          this.shaking_ur5_1 = JSON.parse(shakingString);
      }

      let rewardString = localStorage.getItem('reward_ur5_1');
      if (rewardString !== null) {
          this.reward_ur5_1 = JSON.parse(rewardString);
      }

      let distanceString = localStorage.getItem('distance_ur5_1');
      if (distanceString !== null) {
          this.distance_ur5_1 = JSON.parse(distanceString);
      }

      let distanceThresholdString = localStorage.getItem('distance_threshold_ur5_1');
      if (distanceThresholdString !== null) {
          this.distance_threshold_ur5_1 = JSON.parse(distanceThresholdString);
      }

      console.log('Data loaded from local storage');

    } else {

      data = await d3.csv("http://localhost:4200/assets/test_csv.csv");

      

      
      this.episode = [];
      this.is_success = [];
      this.step = [];
      this.success_rate = [];
      this.out_of_bounds_rate = [];
      this.timeout_rate = [];
      this.collision_rate = [];
      this.sim_time = [];
      this.cpu_time = [];
      this.action_cpu_time_ur5_1 = [];
      this.joints_angles_ur5_1 = [];
      this.joints_velocities_ur5_1 = [];
      this.joints_sensor_cpu_time_ur5_1 = [];
      this.position_link_7_ur5_1 = [];
      this.velocity_link_7_ur5_1 = [];
      this.rotation_link_7_ur5_1 = [];
      this.position_rotation_sensor_cpu_time_ur5_1 = [];
      this.shaking_ur5_1 = [];
      this.reward_ur5_1 = [];
      this.distance_ur5_1 = [];
      this.distance_threshold_ur5_1 = [];

      data.forEach(row => {
        this['episode'].push(+row['episode']! || 0);
        this['is_success'].push(row['is_success'] === 'TRUE');
        this['step'].push(+row['step']! || 0);
        this['success_rate'].push(+row['success_rate']! || 0);
        this['out_of_bounds_rate'].push(+row['out_of_bounds_rate']! || 0);
        this['timeout_rate'].push(+row['timeout_rate']! || 0);
        this['collision_rate'].push(+row['collision_rate']! || 0);
        this['sim_time'].push(+row['sim_time']! || 0);
        this['cpu_time'].push(+row['cpu_time']! || 0);
        this['action_cpu_time_ur5_1'].push(+row['action_cpu_time_ur5_1']! || 0);
        this['joints_angles_ur5_1'].push(row['joints_angles_ur5_1']!.slice(1, -1).split(' ').slice(0, 6).map(x => +x) || Array(6).fill(0));
        this['joints_velocities_ur5_1'].push(row['joints_velocities_ur5_1']!.slice(1, -1).split(' ').slice(0, 6).map(x => +x) || Array(6).fill(0));
        this['joints_sensor_cpu_time_ur5_1'].push(+row['joints_sensor_cpu_time_ur5_1']! || 0);
        this['position_link_7_ur5_1'].push(row['position_link_7_ur5_1']!.slice(1, -1).trim().split(' ').slice(0, 3).map(x => +x) || [0, 0, 0]);
        this['velocity_link_7_ur5_1'].push(row['velocity_link_7_ur5_1']!.slice(1, -1).split(' ').slice(0, 3).map(x => +x) || [0, 0, 0]);
        this['rotation_link_7_ur5_1'].push(row['rotation_link_7_ur5_1']!.slice(1, -1).split(' ').slice(0, 3).map(x => +x) || [0, 0, 0]);
        this['position_rotation_sensor_cpu_time_ur5_1'].push(+row['position_rotation_sensor_cpu_time_ur5_1']! || 0);
        this['shaking_ur5_1'].push(+row['shaking_ur5_1']! || 0);
        this['reward_ur5_1'].push(+row['reward_ur5_1']! || 0);
        this['distance_ur5_1'].push(+row['distance_ur5_1']! || 0);
        this['distance_threshold_ur5_1'].push(+row['distance_threshold_ur5_1']! || 0);
      });

      // Save the data in local storage
      localStorage.setItem('episode', JSON.stringify(this.episode));
      localStorage.setItem('is_success', JSON.stringify(this.is_success));
      localStorage.setItem('step', JSON.stringify(this.step));
      localStorage.setItem('success_rate', JSON.stringify(this.success_rate));
      localStorage.setItem('out_of_bounds_rate', JSON.stringify(this.out_of_bounds_rate));
      localStorage.setItem('timeout_rate', JSON.stringify(this.timeout_rate));
      localStorage.setItem('collision_rate', JSON.stringify(this.collision_rate));
      localStorage.setItem('sim_time', JSON.stringify(this.sim_time));
      localStorage.setItem('cpu_time', JSON.stringify(this.cpu_time));
      localStorage.setItem('action_cpu_time_ur5_1', JSON.stringify(this.action_cpu_time_ur5_1));
      localStorage.setItem('joints_angles_ur5_1', JSON.stringify(this.joints_angles_ur5_1));
      localStorage.setItem('joints_velocities_ur5_1', JSON.stringify(this.joints_velocities_ur5_1));
      localStorage.setItem('joints_sensor_cpu_time_ur5_1', JSON.stringify(this.joints_sensor_cpu_time_ur5_1));
      localStorage.setItem('position_link_7_ur5_1', JSON.stringify(this.position_link_7_ur5_1));
      localStorage.setItem('velocity_link_7_ur5_1', JSON.stringify(this.velocity_link_7_ur5_1));
      localStorage.setItem('rotation_link_7_ur5_1', JSON.stringify(this.rotation_link_7_ur5_1));
      localStorage.setItem('position_rotation_sensor_cpu_time_ur5_1', JSON.stringify(this.position_rotation_sensor_cpu_time_ur5_1));
      localStorage.setItem('shaking_ur5_1', JSON.stringify(this.shaking_ur5_1));
      localStorage.setItem('reward_ur5_1', JSON.stringify(this.reward_ur5_1));
      localStorage.setItem('distance_ur5_1', JSON.stringify(this.distance_ur5_1));
      localStorage.setItem('distance_threshold_ur5_1', JSON.stringify(this.distance_threshold_ur5_1));

      console.log('Data saved in local storage');
    }

  }
    
  mapRemoteData = (data: d3.DSVRowArray<string>) => {
    return {
      x: data.map(x => x[data.columns[1]] as any),
      y: data.map(x => x[data.columns[2]] as any),
      z: data.map(x => x[data.columns[3]] as any)
    }
  }

  loadExperiment(file: string): Promise<Experiment> {
    return new Promise((resolve, reject) => {
      // Load the CSV file using d3.csv function
      d3.csv(file).then((data) => {
        // Create a new Experiment object
        const experiment: Experiment = {
          name: 'Experiment',
          data: [],
          episodes: {}
        };
      
        // Group the data by episode number
        const groupedData = d3.group(data, d => d['episode']);
      
        // Iterate over the groups and create ExperimentData objects
        groupedData.forEach((episodeData, episode) => {
          const experimentData: ExperimentData = {
            category: { name: 'Category', color: 'blue' },
            trajectories: [],
            avgTrajectory: [] as any,
            avgPathLength: 0,
            episode: parseInt(episode as string),
            is_success: [],
            step: [],
            success_rate: [],
            out_of_bounds_rate: [],
            timeout_rate: [],
            collision_rate: [],
            sim_time: [],
            cpu_time: [],
            action_cpu_time_ur5_1: [],
            joints_angles_ur5_1: [],
            joints_velocities_ur5_1: [],
            joints_sensor_cpu_time_ur5_1: [],
            position_link_7_ur5_1: [],
            velocity_link_7_ur5_1: [],
            rotation_link_7_ur5_1: [],
            position_rotation_sensor_cpu_time_ur5_1: [],
            shaking_ur5_1: [],
            reward_ur5_1: [],
            distance_ur5_1: [],
            distance_threshold_ur5_1: []
          };

          // Iterate over the rows and populate the ExperimentData object arrays
          episodeData.forEach((row: any) => {
            experimentData.episode = +row['episode']! || 0;
            experimentData.is_success.push(row['is_success'] === 'TRUE');
            experimentData.step.push(+row['step']! || 0);
            experimentData.success_rate.push(+row['success_rate']! || 0);
            experimentData.out_of_bounds_rate.push(+row['out_of_bounds_rate']! || 0);
            experimentData.timeout_rate.push(+row['timeout_rate']! || 0);
            experimentData.collision_rate.push(+row['collision_rate']! || 0);
            experimentData.sim_time.push(+row['sim_time']! || 0);
            experimentData.cpu_time.push(+row['cpu_time']! || 0);
            experimentData.action_cpu_time_ur5_1.push(+row['action_cpu_time_ur5_1']! || 0);
            experimentData.joints_angles_ur5_1.push(row['joints_angles_ur5_1']!.slice(1, -1).split(' ').slice(0, 6).map((x: string | number) => +x) || Array(6).fill(0));
            experimentData.joints_velocities_ur5_1.push(row['joints_velocities_ur5_1']!.slice(1, -1).split(' ').slice(0, 6).map((x: string | number) => +x) || Array(6).fill(0));
            experimentData.joints_sensor_cpu_time_ur5_1.push(+row['joints_sensor_cpu_time_ur5_1']! || 0);
            experimentData.position_link_7_ur5_1.push(row['position_link_7_ur5_1']!.slice(1, -1).trim().split(' ').slice(0, 3).map((x: string | number) => +x) || [0, 0, 0]);
            experimentData.velocity_link_7_ur5_1.push(row['velocity_link_7_ur5_1']!.slice(1, -1).split(' ').slice(0, 3).map((x: string | number) => +x) || [0, 0, 0]);
            experimentData.rotation_link_7_ur5_1.push(row['rotation_link_7_ur5_1']!.slice(1, -1).split(' ').slice(0, 3).map((x: string | number) => +x) || [0, 0, 0]);
            experimentData.position_rotation_sensor_cpu_time_ur5_1.push(+row['position_rotation_sensor_cpu_time_ur5_1']! || 0);
            experimentData.shaking_ur5_1.push(+row['shaking_ur5_1']! || 0);
            experimentData.reward_ur5_1.push(+row['reward_ur5_1']! || 0);
            experimentData.distance_ur5_1.push(+row['distance_ur5_1']! || 0);
            experimentData.distance_threshold_ur5_1.push(+row['distance_threshold_ur5_1']! || 0);
            experimentData.avgTrajectory = (this.getAverageXyz(this.mapRemoteData(experimentData.distance_ur5_1)));
          });
      
          experiment.data.push(experimentData);
          experiment.episodes[experimentData.episode] = experimentData;
        });

        // Resolve the Promise with the Experiment object
        resolve(experiment);
      }, (error) => {
        reject(error);
      });
    });
  }

  getExperiment(): Experiment {
    return this.experiments[0];
  }

  
// async loadExperiment(name: string) {
//   const existingExperiment = this.experiments.find(x => x.name);
//   if (existingExperiment) {
//     return existingExperiment;
//   }

//   const newExperiment: Experiment = {
//     name: name,
//     data: []
//   };

//   // ToDo: Kategorien sin abhängig vom experiment, daher muss das iwie dynamisch passieren
//   await Promise.all(this.categories.map(async(category) => {
//     const type = category.name;
//     const trajectories: Data[] = [];
//     for (let i = 1; i < 31; i++) {
//       const remoteData = await d3.dsv(" ", `http://localhost:4200/assets/${name}/${type}/${i}.txt`);
//       const mappedData = this.mapRemoteData(remoteData)
//       trajectories.push(mappedData);
//     }
//     const avgTrajectory = this.getAverageXyz(trajectories);
//     newExperiment.data.push({
//       trajectories,
//       category,
//       avgTrajectory,
//       avgPathLength: this.getAvgPathLength(trajectories)
//     });
//   }));

//   this.experiments.push(newExperiment);
//   return newExperiment;
// }

  getAvgTrajectory(trajectories: Data[]) {
    const avgTrajectory: any = {
      x: [],
      y: [],
      z: []
    };
    for (let i = 0; i < trajectories[0].x.length; i++) {
      const x = trajectories.map(x => x.x[i]);
      const y = trajectories.map(x => x.y[i]);
      const z = trajectories.map(x => x.z[i]);
      avgTrajectory.x.push(this.getAvg(x));
      avgTrajectory.y.push(this.getAvg(y));
      avgTrajectory.z.push(this.getAvg(z));
    }
    return avgTrajectory;
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
  data: ExperimentData[];
  episodes: { [episode: number]: ExperimentData };
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
  episode: number;
  is_success: boolean[];
  step: number[];
  success_rate: number[];
  out_of_bounds_rate: number[];
  timeout_rate: number[];
  collision_rate: number[];
  sim_time: number[];
  cpu_time: number[];
  action_cpu_time_ur5_1: number[];
  joints_angles_ur5_1: number[];
  joints_velocities_ur5_1: number[];
  joints_sensor_cpu_time_ur5_1: number[];
  position_link_7_ur5_1: number[];
  velocity_link_7_ur5_1: number[];
  rotation_link_7_ur5_1: number[];
  position_rotation_sensor_cpu_time_ur5_1: number[];
  shaking_ur5_1: number[];
  reward_ur5_1: number[];
  distance_ur5_1: number[];
  distance_threshold_ur5_1: number[];
}

