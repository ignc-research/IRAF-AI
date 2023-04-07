import { Component, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-server-tasks',
  templateUrl: './server-tasks.component.html',
  styleUrls: ['./server-tasks.component.scss']
})
export class ServerTasksComponent implements OnDestroy {

  logSub: Subscription | null = null;

  tasks: Task[] = [];

  log: string = 'No Log';

  selectedTask: Task | null = null;

  constructor(private apiService: ApiService) {
    this.apiService.getTasks().subscribe(x => this.tasks = x);
  }

  selectTask = (task: any) => {
    if (this.logSub) {
      this.logSub.unsubscribe();
    }

    this.logSub = this.create(`${environment.apiUrl.replace('http', 'ws')}/task/log/${task[0].value.id}`).subscribe(x => {
      this.log += JSON.parse(x.data);
    })
  }

  ngOnDestroy(): void {
      if (this.logSub) {
        this.logSub.unsubscribe();
      }
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
      let ws = new WebSocket(url);
      let observable = new Observable((obs: Observer<MessageEvent>) => {
          ws.onmessage = obs.next.bind(obs);
          ws.onerror = obs.error.bind(obs);
          ws.onclose = obs.complete.bind(obs);
          return ws.close.bind(ws);
      });
      let observer = {
          error: (err: any) => console.error(err),
          complete: () => null,
          next: (data: Object) => {
              console.log('Message sent to websocket: ', data);
              if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify(data));
              }
          }
      };
      return new AnonymousSubject<MessageEvent>(observer, observable);
  }

}
