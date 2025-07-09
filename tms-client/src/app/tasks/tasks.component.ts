import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { TasksService, Task } from './tasks.service';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [RouterOutlet, NgFor, CommonModule],
  template: `
    <h2 style="text-align:center;">Task List</h2>

    <!--Only show Top Task Table if not on /tasks/list -->
    <ng-container *ngIf="!isListTasksRoute">
      <table class="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Project ID</th>
            <th *ngIf="isManageTaskRoute">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let task of tasks">
            <td>{{task.title}}</td>
            <td>{{task.description}}</td>
            <td>{{task.dueDate ? (task.dueDate | date) : 'N/A'}}</td>
            <td>{{task.priority}}</td>
            <td>{{task.dateCreated ? (task.dateCreated | date) : 'N/A'}}</td>
            <td>{{task.projectId}}</td>
          </tr>
        </tbody>
      </table>
    </ng-container>

  
    <router-outlet></router-outlet>
  `,
  styles: [`
    .task-table {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      border-collapse: collapse;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      background-color: #fff;
    }

    .task-table thead {
      background-color: #3f51b5; 
      color: #fff;
    }

    .task-table th {
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
    }

    .task-table tbody tr {
      border-bottom: 1px solid #dee2e6;
      transition: background-color 0.2s;
    }

    .task-table tbody tr:hover {
      background-color: #f1f1f1;
    }

    .task-table td {
      padding: 12px 15px;
      font-size: 14px;
      color: #333;
    }

    .task-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    button {
      margin-right: 8px;
      padding: 5px 10px;
      font-size: 13px;
      cursor: pointer;
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  isManageTaskRoute = false;
  isListTasksRoute = false;

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.reloadTasks();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.isListTasksRoute = url.includes('/tasks/list');
      this.isManageTaskRoute = url.includes('/tasks/manage');
    });
  }

  reloadTasks() {
    this.tasksService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }
}