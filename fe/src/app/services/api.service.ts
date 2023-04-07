import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IEnvironment } from '../models/environment';
import { IGoal } from '../models/goal';
import { IObstacle } from '../models/obstacle';
import { IRobot, ISensor } from '../models/robot';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  getObstacles = this.httpClient.get<IObstacle[]>(`${environment.apiUrl}/obstacle`);

  getRobots = this.httpClient.get<IRobot[]>(`${environment.apiUrl}/robot`);

  getSensors = this.httpClient.get<ISensor[]>(`${environment.apiUrl}/sensor`);

  getGoals = this.httpClient.get<IGoal[]>(`${environment.apiUrl}/goal`);

  getEnvironment = this.httpClient.get<IEnvironment>(`${environment.apiUrl}/environment`);

  getConfigs = this.httpClient.get<string[]>(`${environment.apiUrl}/config`);

  getConfig = (name: string) => this.httpClient.get<string>(`${environment.apiUrl}/config/${name}`);

  deleteConfig = (name: string) => this.httpClient.delete<string[]>(`${environment.apiUrl}/config/${name}`);

  writeConfig = (name: string, config: string) => this.httpClient.post<string[]>(`${environment.apiUrl}/config/${name}`, JSON.stringify(config), { headers: this.headers });

  runTask = (config: string, type: string) => this.httpClient.get<string>(`${environment.apiUrl}/task/${config}/${type}`);

  getTasks = () => this.httpClient.get<Task[]>(`${environment.apiUrl}/task`);

  constructor(private httpClient: HttpClient) { 

  }
}
