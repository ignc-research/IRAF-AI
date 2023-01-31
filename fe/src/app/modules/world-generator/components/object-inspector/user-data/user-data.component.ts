import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { SceneService, UserData } from '../../../services/scene.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDataComponent {

  @Input()
  userData!: UserData;

  constructor(private sceneService: SceneService) {
    
  }

}
