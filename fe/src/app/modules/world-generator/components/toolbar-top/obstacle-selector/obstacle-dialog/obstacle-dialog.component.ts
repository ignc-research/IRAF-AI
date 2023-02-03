import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getObstacleUrl, ObstacleDefinition } from 'src/app/models/obstacle';
import { GeneratorApiService } from 'src/app/modules/world-generator/services/generator.api.service';
import { environment } from 'src/environment/environment';
import { UrdfPreviewDialogComponent } from '../../../urdf-preview/urdf-preview-dialog/urdf-preview-dialog.component';

@Component({
  selector: 'app-obstacle-dialog',
  templateUrl: './obstacle-dialog.component.html',
  styleUrls: ['./obstacle-dialog.component.scss']
})
export class ObstacleDialogComponent {

  urdfPath: string | null = null;

  selectedCategory!: ObstacleDefinition;


  constructor(public dialogRef: MatDialogRef<ObstacleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: GeneratorApiService) {
    
  }
  
  refreshPreview() {
    if (!this.selectedCategory || !this.selectedCategory.urdf) {
      this.urdfPath = null;
      return;
    }
    this.urdfPath = getObstacleUrl(this.selectedCategory);
  }

}
