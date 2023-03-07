import { Injectable } from '@angular/core';
import {Data} from "plotly.js-dist-min";
import * as d3 from "d3";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  public titleSubjects: BehaviorSubject<string>[] = []

  public registerTitleSub(sub: BehaviorSubject<string>) {
    this.titleSubjects.push(sub);
  }

  public deregisterTitleSub(sub: BehaviorSubject<string>) {
    const idx = this.titleSubjects.indexOf(sub);
    if (idx > -1){
      this.titleSubjects.splice(idx, 1);
    }
  }
}
