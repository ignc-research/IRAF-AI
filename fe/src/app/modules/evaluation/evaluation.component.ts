import {Component, OnInit} from '@angular/core';
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {newPlot, PlotData, PlotlyDataLayoutConfig} from "plotly.js-dist-min";
import * as d3 from "d3";
import {color} from "d3";
declare const Plotly: any;


@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})


export class EvaluationComponent implements OnInit{

  graph: any = undefined;
  graph3d: any = undefined;


  ngOnInit(): void {

    //this.load3dPlot(['DRL', 'NC-RRT', 'prm', 'RRT'], 'lowerleft');

    /*  2D Plot */
    this.graph = {
      data: [],
      layout: {autosize: true, title: 'A Fancy Plot'},
    };

    /*  3D Plot */

   this.graph3d = {
     data: [],
     layout: {
       autosize: true,
       title: 'A Fancy 3D Plot',
       xaxis: {
         title: 'x-axis title'
       },
       yaxis: {
         title: 'y-axis title'
       }
     },

   };


    /* 3D*/

/*
    d3.csv(`http://localhost:4200/assets/sample3d.txt`).then(data => {
      const newData = {
        type: 'scatter3d',
        mode: 'lines',
        x: [] as any[],
        y: [] as any[],
        z: [] as any[]
      };
      for (let i = 0; i < data.length; i++) {
        newData.x.push(data[i][data.columns[0]]);
        newData.y.push(data[i][data.columns[1]]);
        newData.z.push(data[i][data.columns[2]]);
      }
      this.graph3d.data.push(newData);
    });
 */

  }
}

/*
    this.graph3d_drl = {
      data: [

      ],
      layout: {autosize: true, title: 'A Fancy 3D DRL Plot'},
    };
*/

/*
var x:number[] = [];
d3.csv(`http://localhost:4200/assets/sample.txt`).then(data => {
  for (var i = 0; i < data.length; i++) {
    x.push(data[i][data.columns[0]] as any as number)
  }
  for (var i = 1; i < data.columns.length; i++) {
    this.graph.data.push({x, y: [],  type: 'bar' })
  }
  for (var i = 0; i < data.length; i++) {
    for (var j = 1; j < data.columns.length; j++) {
      this.graph.data[j-1].y.push(data[i][data.columns[j]] as any as number)
    }
  }
});
*/




/*


https://plotly.com/javascript/line-charts/

https://www.chartjs.org/docs/latest/configuration/legend.html

 */
