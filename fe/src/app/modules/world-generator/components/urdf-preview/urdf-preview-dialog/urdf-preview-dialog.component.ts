import { Component, Inject, Input } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-urdf-preview-dialog',
  templateUrl: './urdf-preview-dialog.component.html',
  styleUrls: ['./urdf-preview-dialog.component.scss']
})
export class UrdfPreviewDialogComponent {

  @Input() urdfPath!: string;

  constructor(public dialogRef: MatDialogRef<UrdfPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  
}
