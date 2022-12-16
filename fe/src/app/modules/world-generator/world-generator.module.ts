import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scene, PerspectiveCamera, DirectionalLight, Group, LoadingManager, Color } from 'three';
import URDFLoader from 'urdf-loader';
import { WorldGeneratorRoutingModule } from './world-generator-routing.module';
import { WorldGeneratorComponent } from './world-generator.component';



@NgModule({
  declarations: [
    WorldGeneratorComponent
  ],
  imports: [
    CommonModule,
    WorldGeneratorRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class WorldGeneratorModule {

}