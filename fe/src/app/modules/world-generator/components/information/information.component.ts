import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { URDFJoint } from 'libs/urdf-loader/URDFLoader';
import * as YAML from 'js-yaml';
import { SceneService } from '../../services/scene.service';
import { Object3D } from 'three';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent {

  @Input() dataObject?: {
    hoverObject: Object3D | null,
    currentJoint: URDFJoint | null,
    currentJointValue: Number,
    selectedJoint: URDFJoint | null
  };

  @Output() newDataObject = new EventEmitter<Object3D>();
  @Output() filesSelected = new EventEmitter<any>();

  @Input() currentJoint: URDFJoint | null = null;
  @Input() currentJointValue: Number = 0;

  config: any;

  constructor(protected sceneService: SceneService) {
   
  }

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onload = async () => {
            if (typeof reader.result === 'string') {
                let fileContent = reader.result;
                try {
                    const data = YAML.load(fileContent, { json: true, filename: file.name });
                    this.config = data;
                    console.log(data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        reader.readAsText(file);
    }
}


  ngOnChanges(changes: SimpleChanges) {
    if(changes['hoverObject']) {
      if(this.dataObject) {
        this.dataObject = changes['dataObject'].currentValue;
        console.log("dataObject: " , this.dataObject);
      }
      
    }
  }

  

}
