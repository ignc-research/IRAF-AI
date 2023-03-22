import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Experiment } from '../plot-data.service';

export interface DataTableDialogData {
  experiment: Experiment;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @ViewChild('pageInfo') pageInfo!: ElementRef;

  experiment: Experiment;
  dataColumns: string[] = [];
  dataRows: any[][] = [];
  allDataRows: any[][] = [];
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;

  constructor(
    public dialogRef: MatDialogRef<DataTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataTableDialogData
  ) {
    this.experiment = data.experiment;
  }

  ngOnInit(): void {
    this.processData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const closeButtonWrapper = document.querySelector('.close-btn-wrapper');
      if (closeButtonWrapper) {
        (closeButtonWrapper as HTMLElement).style.opacity = '1';
      }
      const paginationElement = document.querySelector('.pagination');
      if (paginationElement) {
        (paginationElement as HTMLElement).style.opacity = '1';
      }
    }, 600);
  }

  close(): void {
    this.dialogRef.close();
  }

  private processData(): void {
    const data = this.experiment.data;

    if (Object.keys(data).length > 0) {
      this.dataColumns = Object.keys(data);

      const rowCount = data[this.dataColumns[0]].length;
      const tempDataRows = new Array(rowCount).fill(null).map((_, rowIndex) => {
        return this.dataColumns.map((columnName) => data[columnName][rowIndex]);
      });

      this.allDataRows = tempDataRows[0].map((_, columnIndex) => {
        return tempDataRows.map((row) => row[columnIndex]);
      });

      this.totalPages = Math.ceil(rowCount / this.pageSize);
      this.updateDataForCurrentPage();
    }
  }

  updateDataForCurrentPage(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataRows = this.allDataRows.slice(startIndex, endIndex).map((row) => {
      return row.map((cell) => {
        if (Array.isArray(cell)) {
          return cell.map((val) => this.formatValue(val)).join('<br>');
        }
        return this.formatValue(cell);
      });
    });
  }

  private formatValue(value: any): string {
    if (typeof value === 'number') {
      return value.toFixed(7) + '...';
    }
    return value;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDataForCurrentPage();
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  animatePageInfo(): void {
    const pageInfoElement = this.pageInfo.nativeElement;

    pageInfoElement.classList.remove('fade-in');

    // Add the animation class back after a small delay
    setTimeout(() => {
      pageInfoElement.classList.add('fade-in');
    }, 50);
  }
}
