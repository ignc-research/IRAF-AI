import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StringUtils } from 'src/app/helpers/string-utils';
import { GeneratorApiService } from '../../../services/generator.api.service';
import { SceneService } from '../../../services/scene.service';
import { ObstacleDialogComponent } from './obstacle-dialog/obstacle-dialog.component';

@Component({
  selector: 'app-obstacle-selector',
  templateUrl: './obstacle-selector.component.html',
  styleUrls: ['./obstacle-selector.component.scss']
})
export class ObstacleSelectorComponent {

  constructor(public dialog: MatDialog, public generatorApi: GeneratorApiService, private sceneService: SceneService) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ObstacleDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.sceneService.addObstacle(result);
    });
  }
}
