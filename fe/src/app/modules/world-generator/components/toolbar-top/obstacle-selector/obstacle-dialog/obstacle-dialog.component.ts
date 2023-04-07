import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IObstacle, Obstacle } from 'src/app/models/obstacle';
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

  selectedCategory!: IObstacle;

  searchUrdf: string = '';
  displayUrdfs: string[] = [];

  constructor(public dialogRef: MatDialogRef<ObstacleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: GeneratorApiService) {
    
  }
  
  search() {
    if (!this.searchUrdf || !this.selectedCategory.urdfs) {
      this.displayUrdfs = this.selectedCategory.urdfs ?? [];
      return;
    }
    this.displayUrdfs = this.selectedCategory.urdfs?.filter(x => x.toLocaleLowerCase().includes(this.searchUrdf.toLocaleLowerCase()));
    if (this.displayUrdfs.length == 1) {
      this.selectedCategory.urdf = this.displayUrdfs[0];
      this.refreshPreview();
    }
  }

  refreshPreview() {
    if (!this.selectedCategory || !this.selectedCategory.urdf) {
      this.urdfPath = null;
      this.search();
      return;
    }
    this.urdfPath = new Obstacle(this.selectedCategory).urdfUrl;
  }
}
