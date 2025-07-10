import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TasksService, Task } from "../tasks.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-read-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <select [(ngModel)]="selectedTaskId" (change)="onTaskSelected(selectedTaskId)">
        <option value="" disabled>Select Task ID</option>
        <option *ngFor="let task of tasks" [value]="task._id">
          {{ task.title }} (ID: {{ task._id }})
        </option>
      </select>

      <div *ngIf="task; else selectTask" class="task-details">
        <h2>{{ task.title }}</h2>
        <p>{{ task.description }}</p>
        <ul>
          <li>Status: {{ task.status }}</li>
          <li>Priority: {{ task.priority }}</li>
          <li>Due Date: {{ task.dueDate | date:'mediumDate' }}</li>
        </ul>
      </div>

      <ng-template #selectTask>
        <p>Please select a task from the dropdown above.</p>
      </ng-template>

      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    select {
      width: 100%;
      padding: 8px;
      margin-bottom: 20px;
    }
    .task-details {
      border-top: 1px solid #ccc;
      padding-top: 15px;
    }
    .error {
      color: red;
      margin-top: 15px;
    }
  `]
})
export class ReadTaskComponent implements OnInit {
  tasks: Task[] = [];
  task: Task | null = null;
  selectedTaskId = '';
  error = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe({
      next: data => this.tasks = data,
      error: err => this.error = 'Failed to load tasks list'
    });
  }

  onTaskSelected(taskId: string): void {
    if (taskId) {
      this.tasksService.getTaskById(taskId).subscribe({
        next: data => {
          this.task = data;
          this.error = '';
        },
        error: err => {
          this.error = 'Failed to load task details';
          this.task = null;
        }
      });
    }
  }
}
