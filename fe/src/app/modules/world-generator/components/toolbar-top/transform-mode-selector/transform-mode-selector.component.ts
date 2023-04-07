import { Component } from '@angular/core';
import { UiControlService } from '../../../services/ui-control.service';

@Component({
  selector: 'app-transform-mode-selector',
  templateUrl: './transform-mode-selector.component.html',
  styleUrls: ['./transform-mode-selector.component.scss']
})
export class TransformModeSelectorComponent {
  constructor(public uiService: UiControlService) {}
}
