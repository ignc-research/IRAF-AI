import { Component } from '@angular/core';
import * as d3 from 'd3';
import { MotionReplayService } from '../../services/motion-replay.service';
@Component({
  selector: 'app-motion-replay',
  templateUrl: './motion-replay.component.html',
  styleUrls: ['./motion-replay.component.scss']
})
export class MotionReplayComponent {

  constructor(public motionReplayService: MotionReplayService) {

  }

  mapJointAngleFormat = (val: string | undefined) => {
    if (!val) {
      return [];
    }
    return val.replace('[', '').replace(']', '').split(' ').filter(x => !!x).map(x => +x);
  }

  onFileSelected = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                let fileContent = reader.result;
                const csvUrl = fileContent
                      ? URL.createObjectURL(new Blob([fileContent], { type: 'text/csv' }))
                      : 'http://localhost:4200/assets/episode_300.csv';

                    d3.csv(csvUrl).then((parsedData) => {
                      this.motionReplayService.angles = {};

                      parsedData.forEach(x => {
                        Object.keys(x).filter(y => y.startsWith('joints_angles_')).forEach(y => {
                          const roboKey = y.replace('joints_angles_', '');

                          if (!this.motionReplayService.angles[roboKey]) {
                            this.motionReplayService.angles[roboKey] = [];
                          }
                          this.motionReplayService.angles[roboKey].push(this.mapJointAngleFormat(x[y]));
                        });
                      })
                    });
            }
        };
        reader.readAsText(file);
        event.target.value = null!;
    }
  }

}
