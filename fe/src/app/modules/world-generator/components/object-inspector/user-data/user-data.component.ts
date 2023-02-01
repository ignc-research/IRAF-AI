import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { SceneService, UserData } from '../../../services/scene.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent {

  userDataKeyValues: { key: string; value: string; }[] = [];

  @Input()
  set userData(value: UserData) {
    this.userDataKeyValues = Object.keys(value ?? {}).filter(x => (typeof value[x]) === "string").map(x => {
      return {
        key: x,
        value: value[x]
      }
    });
  }

  constructor(private sceneService: SceneService) {
    
  }

}
