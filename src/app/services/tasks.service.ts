import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<Task[]>(this.baseUrl + 'tasks/');
  }

  getTask(id: number) {
    return this.http.get<Task>(this.baseUrl + 'tasks/' + id);
  }

  updateTask(task: Task) {
    return this.http.put(this.baseUrl + 'tasks/' + task.id, task);
  }

  deleteTask(id: number) {
    return this.http.delete(this.baseUrl + 'tasks/' + id);
  }

  addTask(task: Task) {
    return this.http.post(this.baseUrl + 'tasks/add-task', task);
  }
}
