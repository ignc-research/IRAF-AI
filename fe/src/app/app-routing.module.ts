import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'pose-estimation',
    loadChildren: () => import('./modules/pose-estimation/pose-estimation.module').then(m => m.PoseEstimationModule)
  },
  {
    path: 'evaluation',
    loadChildren: () => import('./modules/evaluation/evaluation.module').then(m => m.EvaluationModule)
  },
  {
    path: 'world-generator',
    loadChildren: () => import('./modules/world-generator/world-generator.module').then(m => m.WorldGeneratorModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
