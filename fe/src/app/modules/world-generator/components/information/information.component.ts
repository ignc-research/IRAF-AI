import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Color, LoaderUtils, Mesh, MeshLambertMaterial, Object3D } from 'three';
import URDFLoader, { URDFJoint, URDFRobot } from 'urdf-loader';

@Component({
  selector: 'app-information',
  standalone: true,
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {

  constructor() { }

  @Input() dataObject?: {
    hoverObject: Object3D | null,
    currentJoint: URDFJoint | null,
    currentJointValue: Number
  };

  @Output() newDataObject = new EventEmitter<Object3D>();

  @Input() currentJoint: URDFJoint | null = null;
  @Input() currentJointValue: Number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if(changes['hoverObject']) {
      if(this.dataObject) {
        this.dataObject = changes['dataObject'].currentValue;
        console.log("dataObject: " , this.dataObject);
      }
    }
  }

  

}
