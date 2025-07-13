<<<<<<< HEAD
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TasksService, Task } from "../tasks.service";
import { FormsModule } from "@angular/forms";
=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TasksService, Task } from '../tasks.service';
>>>>>>> test

@Component({
  selector: 'app-read-task',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="task-reader-container">
      <h2>Select a Task</h2>
      <select [(ngModel)]="selectedId" (change)="loadTask(selectedId)">
        <option value="" disabled selected>Select task...</option>
        <option *ngFor="let t of tasks" [value]="t._id">{{ t.title }}</option>
      </select>
      <div *ngIf="error" class="error">{{ error }}</div>
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
<<<<<<< HEAD
  task: Task | null = null;
  selectedTaskId = '';
=======
  selectedId = '';
  task: Task | null = null;
>>>>>>> test
  error = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe({
<<<<<<< HEAD
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
=======
      next: list => this.tasks = list,
      error: () => this.error = 'Failed to load task list'
    });
  }

  loadTask(id: string): void {
    this.error = '';
    this.task = null;
    if (!id) return;
    this.tasksService.getTaskById(id).subscribe({
      next: data => this.task = data,
      error: err => {
        this.error = err.status === 404 ? 'Task not found' : 'Failed to load task';
      }
    });
  }
}
>>>>>>> test
