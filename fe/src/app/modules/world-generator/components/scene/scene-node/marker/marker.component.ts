import { Component, Input } from '@angular/core';
import { Marker } from 'src/app/models/marker';
import { UiControlService } from 'src/app/modules/world-generator/services/ui-control.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent {
  @Input()
  marker!: Marker;

  constructor(private uiService: UiControlService) {

  }
}
