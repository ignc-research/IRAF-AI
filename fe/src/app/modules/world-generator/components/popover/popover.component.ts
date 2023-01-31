import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-popover',
  template: `
    <div *ngIf="active" [style.top]="top" [style.left]="left" class="popover">
        <div class="popover-title">
          Select sensors
        </div>
        <div class="popover-content">
        <div *ngFor="let item of options">
          <input type="checkbox" [(ngModel)]="item.selected" (change)="onCheckboxChanged(item)">
          {{item.name}}
        </div>
        </div>
    </div>
  `,
  styles: [`
    .popover {
      position: absolute;
      background-color: rgba(239, 239, 239, 0.85);
      height: 200px;
      width: 150px;
      z-index: 999;
      border: 1px solid rgba(209, 209, 209, 0.9);
    }
    .popover-title {
      font-weight: bold;
    }
  `]
})

export class PopoverComponent {
  @Input() active: boolean = true;
  @Input() position: {x: number, y: number} = {x:0, y:0};

  options = [
    { name: 'Lidar', selected: false },
    { name: 'Sensor2', selected: false },
    { name: 'Sensor 3', selected: false },
    { name: 'Sensor 4', selected: false }
  ];

  get top() {
    return this.position.y + 'px';
  }

  get left() {
    return this.position.x + 'px';
  }

  onCheckboxChanged(item: any) {
    console.log(item);
  }

}
