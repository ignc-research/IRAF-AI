import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorldGeneratorComponent } from './world-generator.component';

const routes: Routes = [
  {
    path: '',
    component: WorldGeneratorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorldGeneratorRoutingModule { }
