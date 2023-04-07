import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerTasksRoutingModule } from './server-tasks-routing.module';
import { ServerTasksComponent } from './server-tasks.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ServerTasksComponent,
    NewTaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,

    ServerTasksRoutingModule,

    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatListModule
  ]
})
export class ServerTasksModule { }
