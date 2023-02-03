import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObstacleDefinition } from 'src/app/models/obstacle';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneratorApiService  {

  robotUrdfs: string[] = [];

  obstacles: ObstacleDefinition[] = [];

  constructor(private httpClient: HttpClient) { 
    this.httpClient.get<ObstacleDefinition[]>(`${environment.apiUrl}/obstacle`).subscribe(x => {
      this.obstacles = x
    });
    this.httpClient.get<string[]>(`${environment.apiUrl}/urdf/robot`).subscribe(x => {
      this.robotUrdfs = x.map(x => '/urdf/robot/' + x);
    });
  }
}


