import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="list-container">
      <h2>All Tasks</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <ng-container *ngIf="tasks.length; else noTasks">
        <table class="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Project ID</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tasks">
              <td>{{ t.title }}</td>
              <td>{{ t.description || 'N/A' }}</td>
              <td>{{ t.status }}</td>
              <td>{{ t.priority }}</td>
              <td>{{ t.dueDate ? (t.dueDate | date:'mediumDate') : 'N/A' }}</td>
              <td>{{ t.projectId }}</td>
            </tr>
          </tbody>
        </table>
      </ng-container>
      <ng-template #noTasks>
        <p>No tasks available.</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
    .list-container {
      max-width: 800px;
      margin: 2rem auto;
      font-family: Arial, sans-serif;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    .error {
      color: #e74c3c;
      text-align: center;
      margin-bottom: 1rem;
    }
    .task-table {
      width: 100%;
      border-collapse: collapse;
    }
    .task-table th, .task-table td {
      padding: 0.75rem;
      border: 1px solid #ddd;
      text-align: left;
    }
    .task-table thead {
      background-color: #3f51b5;
      color: white;
    }
    `
  ]
})
export class ListTasksComponent implements OnInit {
  tasks: Task[] = [];
  error = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe({
      next: (data: Task[]) => this.tasks = data,
      error: (err: any) => {
        console.error('Error fetching tasks:', err);
        this.error = 'Failed to load task list';
      }
    });
  }
}
