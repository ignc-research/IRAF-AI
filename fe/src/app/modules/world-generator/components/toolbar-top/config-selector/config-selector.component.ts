import { Component, ViewChild } from '@angular/core';
import { ConfigUtils } from 'src/app/helpers/config-utils';

@Component({
  selector: 'app-config-selector',
  templateUrl: './config-selector.component.html',
  styleUrls: ['./config-selector.component.scss']
})
export class ConfigSelectorComponent {

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                let fileContent = reader.result;
                ConfigUtils.parseConfig(fileContent);
            }
        };
        reader.readAsText(file);
    }
  }
}
