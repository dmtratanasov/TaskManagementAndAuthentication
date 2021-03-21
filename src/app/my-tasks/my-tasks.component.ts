import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Task } from '../models/task';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

enum TaskStatus {
  'Work in Progress' = 1,
  'Deleted' = 2,
  'Done' = 3,
  'To do' = 4,
}

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css'],
})
export class MyTasksComponent implements OnInit {
  public tasks: Task[];
  public isLoading: boolean;
  formGroupNewTask;
  public keys: any[];
  public statuses = TaskStatus;
  public filterTasks: string = 'All';
  public editingState: boolean = false;
  public taskToEdit: Task;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _tasksService: TasksService,
    public datePipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.keys = Object.keys(this.statuses).filter((f) => !isNaN(Number(f)));

    this.formGroupNewTask = this.formBuilder.group({
      description: [''],
      status: [''],
      from: [Date],
      to: [Date],
    });
  }

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  deletedTasks: Task[] = [];

  toggleEditingState() {
    this.editingState = !this.editingState;
    this.formGroupNewTask.reset();
  }

  switchToEditingTask(taskId: number) {
    if (this.editingState == false) {
      this.editingState = true;
    }
    this.scrollToTop();
    this._tasksService.getTask(taskId).subscribe((task) => {
      this.formGroupNewTask.patchValue({
        description: task[0].description,
        status: task[0].status,
        from: this.datePipe.transform(task[0].from, 'yyyy-MM-dd'),
        to: this.datePipe.transform(task[0].to, 'yyyy-MM-dd'),
      });
      this.taskToEdit = task;
    });
  }

  updateTask(task: Task) {
    if (task) {
      task[0].description = this.formGroupNewTask.get('description').value;
      task[0].status = this.formGroupNewTask.get('status').value;
      task[0].from = this.formGroupNewTask.get('from').value;
      task[0].to = this.formGroupNewTask.get('to').value;
      this.isLoading = true;
      this._tasksService.updateTask(task[0]).subscribe(() => {
        console.log('Task Updated');
        this.formGroupNewTask.reset();
        var taskIndex = this.tasks.findIndex((x => x.id == task[0].id));
        this.tasks[taskIndex] = task[0];
        this.splitTasksByStatus();
        this.toastr.info('Task Updated Successfully!')
        this.toggleEditingState();
        this.isLoading = false;
      });
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }

  filteringTasks(s: string) {
    if (s == 'To do') {
      this.filterTasks = 'To do';
    }
    if (s == 'Work In Progress') {
      this.filterTasks = 'Work In Progress';
    }
    if (s == 'Done') {
      this.filterTasks = 'Done';
    }
    if (s == 'All') {
      this.filterTasks = 'All';
    }
  }

  addTask(formData): void {
    var task = new Task();
    task.description = formData.value['description'];
    task.status = formData.value['status'];
    task.from = formData.value['from'];
    task.to = formData.value['to'];

    this.isLoading = true;
    this._tasksService.addTask(task).subscribe((data: any) => {
      this.router.navigate(['/mytasks']);
      this.formGroupNewTask.reset();
      this.isLoading = false;
      this.tasks.push(data);
      this.splitTasksByStatus();
      this.toastr.success('Task Added Successfully!')
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  deleteTask(id: number) {
    this._tasksService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(x => x.id != id);
      this.splitTasksByStatus();
      this.toastr.success('Task Deleted Successfully!');
    },
    (error) => {
      console.log(error);
      this.toastr.error(error);
    });
  }

  loadTasks() {
    this._tasksService.getTasks().subscribe((response) => {
      this.tasks = response;
      this.splitTasksByStatus();
    });
  }

  splitTasksByStatus() {
    this.todoTasks = [];
    this.doneTasks = [];
    this.inProgressTasks = [];
    for (let task of this.tasks) {
      if (task.status == TaskStatus[4]) {
        this.todoTasks.push(task);
      } else if (task.status == TaskStatus[3]) {
        this.doneTasks.push(task);
      } else if (task.status == TaskStatus[1]) {
        this.inProgressTasks.push(task);
      }
    }
  }
}
