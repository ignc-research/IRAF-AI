import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEnvironment } from 'src/app/models/environment';
import { IGoal } from 'src/app/models/goal';
import { IObstacle } from 'src/app/models/obstacle';
import { IRobot, ISensor } from 'src/app/models/robot';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneratorApiService  {

  environment?: IEnvironment;

  robots: IRobot[] = [];

  obstacles: IObstacle[] = [];

  sensors: ISensor[] = [];

  goals: IGoal[] = [];

  constructor(private apiService: ApiService) { 
    this.apiService.getObstacles.subscribe(x => {
      this.obstacles = x
    });
    this.apiService.getRobots.subscribe(x => {
      this.robots = x;
    });
    this.apiService.getSensors.subscribe(x => {
      this.sensors = x;
    });
    this.apiService.getGoals.subscribe(x => {
      this.goals = x;
    });
    this.apiService.getEnvironment.subscribe(x => {
      this.environment = x;
    });
  }
}


