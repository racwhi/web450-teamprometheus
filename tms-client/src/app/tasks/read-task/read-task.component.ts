// src/app/tasks/read-task/read-task.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TasksService, Task } from '../tasks.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-read-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-reader-container">
      <!-- Dynamic header: show task title or default prompt -->
      <h2 *ngIf="task; else noSelect">Task: {{ task.title }}</h2>
      <ng-template #noSelect><h2>Select a Task</h2></ng-template>

      <!-- Dropdown of available tasks -->
      <select [(ngModel)]="selectedId" (change)="loadTask(selectedId)">
        <option value="" disabled>Select task...</option>
        <option *ngFor="let t of tasks" [value]="t._id">{{ t.title }}</option>
      </select>

      <!-- Error message -->
      <div *ngIf="error" class="error">{{ error }}</div>

      <!-- Task detail card -->
      <div *ngIf="task" class="task-card">
        <h3>{{ task.title }}</h3>
        <p><strong>Description:</strong> {{ task.description || 'N/A' }}</p>
        <p><strong>Status:</strong> {{ task.status }}</p>
        <p><strong>Priority:</strong> {{ task.priority }}</p>
        <p *ngIf="task.dueDate"><strong>Due Date:</strong> {{ task.dueDate | date:'mediumDate' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .task-reader-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
      font-family: Arial, sans-serif;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    select {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    .error {
      color: #e74c3c;
      margin-bottom: 1rem;
      text-align: center;
      font-weight: bold;
    }
    .task-card {
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
      margin-top: 1rem;
    }
    .task-card h3 {
      margin-top: 0;
    }
    .task-card p {
      margin: 0.5rem 0;
    }
  `]
})
export class ReadTaskComponent implements OnInit {
  tasks: Task[] = [];
  selectedId = '';
  task: Task | null = null;
  error = '';

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load task list for dropdown
    this.tasksService.getTasks().subscribe(
      list => this.tasks = list,
      () => {/* ignore list-load errors */}
    );

    // If URL has id param, auto-load that task
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.selectedId = id;
      this.loadTask(id);
    }
  }

  loadTask(id: string): void {
    this.error = '';
    this.task = null;
    if (!id) return;

    this.tasksService.getTaskById(id).subscribe({
      next: data => this.task = data,
      error: (err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          this.error = 'Task not found';
        } else {
          this.error = 'Failed to load task';
        }
      }
    });
  }
}