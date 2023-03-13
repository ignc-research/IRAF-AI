import { Component, ViewChild } from '@angular/core';

import { ConfigService } from '../../../services/config.service';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-config-selector',
  templateUrl: './config-selector.component.html',
  styleUrls: ['./config-selector.component.scss']
})
export class ConfigSelectorComponent {

  constructor(private configService: ConfigService) {
    
  }

  createNewConfig() {
    this.configService.parseConfig();
  }

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                let fileContent = reader.result;
                this.configService.parseConfig(fileContent);
            }
        };
        reader.readAsText(file);
    }
  }
}
