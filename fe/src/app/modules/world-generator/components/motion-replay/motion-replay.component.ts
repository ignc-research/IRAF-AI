import { Component } from '@angular/core';

@Component({
  selector: 'app-motion-replay',
  templateUrl: './motion-replay.component.html',
  styleUrls: ['./motion-replay.component.scss']
})
export class MotionReplayComponent {

  

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                let fileContent = reader.result;
                
            }
        };
        reader.readAsText(file);
        event.target.value = null!;
    }
  }
}
