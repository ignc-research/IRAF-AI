import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { ServerTasksComponent } from './server-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: ServerTasksComponent
  },
  {
    path: 'new-task',
    component: NewTaskComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerTasksRoutingModule { }
