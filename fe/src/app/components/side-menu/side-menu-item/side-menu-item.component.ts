import { Component, Input } from '@angular/core';
import { SideMenuComponent } from '../side-menu.component';

@Component({
  selector: 'app-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss']
})
export class SideMenuItemComponent {

  @Input()
  icon!: string;

  @Input()
  routerLink!: any[] | string | null | undefined;

  constructor(protected sideMenu: SideMenuComponent) {

  }
}
