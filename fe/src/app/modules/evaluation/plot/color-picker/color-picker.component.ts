import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorService } from 'src/app/modules/evaluation/plot/color.service';
import { Experiment } from '../plot-data.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  color: string;

  constructor(
    public dialogRef: MatDialogRef<ColorPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { experiment: Experiment },
    private colorService: ColorService
  ) {
    this.color = this.colorService.getColor(data.experiment.name);
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.color);
  }

}
