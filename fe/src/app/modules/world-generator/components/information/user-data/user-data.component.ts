import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-user-data',
  standalone: true,
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class UserDataComponent {

  userData!: Observable<any[]>;

  constructor(private sceneService: SceneService) {
    this.userData = sceneService.selectedObject.asObservable().pipe(map(x => {
      if (!x?.userData) {
        return [];
      }
      return Object.keys(x.userData).map(y => {
        return {
          key: y,
          value: x.userData[y]
        }
      })
    }))
  }

}
