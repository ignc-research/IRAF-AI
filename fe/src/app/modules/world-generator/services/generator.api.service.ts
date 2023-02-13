import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IObstacle } from 'src/app/models/obstacle';
import { ISensor } from 'src/app/models/robot';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneratorApiService  {

  robotUrdfs: string[] = [];

  obstacles: IObstacle[] = [];

  sensors: ISensor[] = [
    {
      type: 'LiDAR',
      link: ''
    },
    {
      type: 'RGB',
      link: ''
    }
  ];

  constructor(private httpClient: HttpClient) { 
    this.httpClient.get<IObstacle[]>(`${environment.apiUrl}/obstacle`).subscribe(x => {
      this.obstacles = x
    });
    this.httpClient.get<string[]>(`${environment.apiUrl}/urdf/robot`).subscribe(x => {
      this.robotUrdfs = x.map(x => '/urdf/robot/' + x);
    });
  }
}


