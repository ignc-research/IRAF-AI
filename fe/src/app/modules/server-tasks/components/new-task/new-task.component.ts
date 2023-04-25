import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as ace from 'ace-builds';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent {

  taskMode: 'eval' | 'train' = 'eval';

  configs: string[] = [];

  selectedConfig: string = '';

  configName: string = '';

  configContent: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {
    this.apiService.getConfigs.subscribe(x => this.configs = x);

    const routeConfig = this.router.getCurrentNavigation()?.extras?.state?.["config"];
    if (routeConfig) {
      this.configContent = routeConfig;
    }
  }

  onConfigChange = () => {
    if (!this.selectedConfig) {
      this.configContent = null;
      return;
    }
    this.apiService.getConfig(this.selectedConfig).subscribe(x => this.configContent = x);
  }

  deleteConfig = () => {
    this.apiService.deleteConfig(this.selectedConfig).subscribe(x => {
      this.configs = x;
      this.configContent = null;
    });
  }

  writeConfig = () => {
    const configName = this.selectedConfig ? this.selectedConfig : this.configName;
    this.apiService.writeConfig(configName, this.configContent ?? '').subscribe(x => {
      this.configs = x;
      this.selectedConfig = configName;
    });
  }

  runTask = () => {
    this.apiService.runTask(this.selectedConfig, this.taskMode).subscribe(x => console.log(x));
  }
}
