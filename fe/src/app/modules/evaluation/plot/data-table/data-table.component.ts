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
  currentPage: number = 1;
  pageSize: number = 50; // Adjust the number of rows per page
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
    }, 600); // Update the time to 1 second
  }

  close(): void {
    this.dialogRef.close();
  }

  private processData(): void {
    if (this.experiment.data.length > 0) {
      const firstEpisode = this.experiment.data[0];

      // Get the column names
      this.dataColumns = ['episode', ...Object.keys(firstEpisode.data)];

      // Get the data rows
      const allDataRows = this.experiment.data.flatMap((episode) => {
        const timesteps = episode.data[this.dataColumns[1]].length; // Use the first data column to determine the number of timesteps
        return Array.from({ length: timesteps }, (_, timestepIndex) => {
          return [
            episode.episode,
            ...this.dataColumns.slice(1).map((columnName) => episode.data[columnName][timestepIndex]),
          ];
        });
      });

      // Calculate the total number of pages
      this.totalPages = Math.ceil(allDataRows.length / this.pageSize);

      // Update table data for the current page
      this.updateTableData(allDataRows, this.currentPage);
    }
  }

  private updateTableData(allDataRows: any[][], page: number): void {
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.dataRows = allDataRows.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.processData();
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

    // Remove the animation class if it's already there
    pageInfoElement.classList.remove('fade-in');

    // Add the animation class back after a small delay
    setTimeout(() => {
      pageInfoElement.classList.add('fade-in');
    }, 50);
  }
}
