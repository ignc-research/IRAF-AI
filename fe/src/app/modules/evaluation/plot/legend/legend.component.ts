import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PlotService} from "../plot.service";
import {PlotDataService} from "../plot-data.service";

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent {
  public selectedTitleSub?: BehaviorSubject<string>;

  constructor(public plotUiService: PlotService, public plotService: PlotDataService){}

  titleChange = (ev: any) => {
    const newValue = ev.target.value;
    if (this.selectedTitleSub){
      this.selectedTitleSub.next(newValue);
    }
  }

  toggleAverage(eventTarget: any, type: string) {
    const isVisible = eventTarget.checked;
    this.plotService.updateCategory(type, undefined, undefined, isVisible);
  }

  changeLineType(eventTarget: any, type: string) {
    const lineType = eventTarget.value;
    this.plotService.updateCategory(type, undefined, lineType);
  }
}
