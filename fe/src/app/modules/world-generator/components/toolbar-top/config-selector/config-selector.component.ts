import { Component, ViewChild } from '@angular/core';

import { ConfigService } from '../../../services/config.service';
import { SceneService } from '../../../services/scene.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-selector',
  templateUrl: './config-selector.component.html',
  styleUrls: ['./config-selector.component.scss']
})
export class ConfigSelectorComponent {

  constructor(private configService: ConfigService, public sceneService: SceneService, private router: Router) {
    
  }

  createNewConfig() {
    this.sceneService.rootNode = this.configService.parseConfig() ?? undefined;
  }

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                let fileContent = reader.result;
                const env = this.configService.parseConfig(fileContent);
                if (env) {
                  // Fix for refs not updating properly
                  setTimeout(() => (this.sceneService.rootNode = undefined), 0);
                  setTimeout(() => (this.sceneService.rootNode = env), 0);
                }
            }
        };
        reader.readAsText(file);
        event.target.value = null!;
    }
  }

  exportConfig() {
    this.configService.downloadYAML(this.configService.exportConfig(this.sceneService.rootNode!));
  }

  runConfigAsNewTask() {
    this.router.navigateByUrl('/server-tasks/new-task', { state: { config: this.configService.exportConfig(this.sceneService.rootNode!) } });
  }
}
