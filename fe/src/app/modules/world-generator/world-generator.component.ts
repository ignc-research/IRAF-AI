import { Component, NgZone } from '@angular/core';
import { SceneService } from './services/scene.service';


@Component({
  selector: 'app-home',
  templateUrl: './world-generator.component.html',
  styleUrls: ['./world-generator.component.scss']
})

export class WorldGeneratorComponent {
  constructor(public sceneService: SceneService) {
    
  }
  
}