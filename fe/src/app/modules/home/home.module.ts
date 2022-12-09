import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgtCanvasModule } from '@angular-three/core';
import { CubeComponent } from './components/cube/cube.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CubeComponent,
    HomeComponent,
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
