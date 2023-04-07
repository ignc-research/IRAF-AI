import {  Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UrdfPreviewDialogComponent } from './urdf-preview-dialog/urdf-preview-dialog.component';

@Component({
  selector: 'app-urdf-preview',
  templateUrl: './urdf-preview.component.html',
  styleUrls: ['./urdf-preview.component.scss'],
})
export class UrdfPreviewComponent  {

  @Input() urdfPath!: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(UrdfPreviewDialogComponent, {
      data: {},
    });

    dialogRef.componentInstance.urdfPath = this.urdfPath;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
