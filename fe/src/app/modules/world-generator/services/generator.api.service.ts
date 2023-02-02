import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneratorApiService  {

  robotUrdfs: string[] = [];

  obstacleUrdfs: string[] = [];

  constructor(private httpClient: HttpClient) { 
    this.httpClient.get<string[]>(`${environment.apiUrl}/urdf/obstacle`).subscribe(x => {
      this.obstacleUrdfs = x.map(x => '/urdf/obstacle/' + x);
    });
    this.httpClient.get<string[]>(`${environment.apiUrl}/urdf/robot`).subscribe(x => {
      this.robotUrdfs = x.map(x => '/urdf/robot/' + x);
    });
  }




}
