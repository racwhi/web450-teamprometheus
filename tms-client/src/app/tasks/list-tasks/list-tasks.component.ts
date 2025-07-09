import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksService, Task } from '../tasks.service';


@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tasks-container">
     
      <div *ngIf="tasks.length === 0">No tasks available.</div>
      <div class="task-card" *ngFor="let task of tasks">
        <h3>{{ task.title }}</h3>
        <p><strong>Status:</strong> {{ task.status }}</p>
        <p><strong>Priority:</strong> {{ task.priority }}</p>
        <p><strong>Due Date:</strong> {{ task.dueDate | date }}</p>
      </div>
    </div>
  `,
  styles: `
    .tasks-container {
      padding: 20px;
    }
    .task-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
      text-align: left;
    }
    .task-card h3 {
      margin: 0 0 8px 0;
      color: #333;
    }
    .task-card p {
      margin: 4px 0;
      font-size: 14px;
      color: #555;
    }
  `
})
export class ListTasksComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
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