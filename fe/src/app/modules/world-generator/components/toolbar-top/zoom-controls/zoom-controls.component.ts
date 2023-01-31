import { Component } from '@angular/core';
import { UiControlService } from '../../../services/ui-control.service';

@Component({
  selector: 'app-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss']
})
export class ZoomControlsComponent {
  set enableZoom(value: string[]) {
    this.uiService.enableZoom = value.length > 0;
  }
  get enableZoom() {
    return this.uiService.enableZoom ? ['enable_zoom'] : [];
  }

  constructor(public uiService: UiControlService) {}
}
