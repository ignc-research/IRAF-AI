import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEnvironment } from 'src/app/models/environment';
import { IGoal } from 'src/app/models/goal';
import { IObstacle } from 'src/app/models/obstacle';
import { IRobot, ISensor } from 'src/app/models/robot';
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

  constructor(private httpClient: HttpClient) { 
    this.httpClient.get<IObstacle[]>(`${environment.apiUrl}/obstacle`).subscribe(x => {
      this.obstacles = x
    });
    this.httpClient.get<IRobot[]>(`${environment.apiUrl}/robot`).subscribe(x => {
      this.robots = x;
    });
    this.httpClient.get<ISensor[]>(`${environment.apiUrl}/sensor`).subscribe(x => {
      this.sensors = x;
    });
    this.httpClient.get<IGoal[]>(`${environment.apiUrl}/goal`).subscribe(x => {
      this.goals = x;
    });
    this.httpClient.get<IEnvironment>(`${environment.apiUrl}/environment`).subscribe(x => {
      this.environment = x;
    });
  }
}


