
//manage-task.component
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-manage-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `

  <h2 class="heading">Manage Task</h2>
    <div class="container">
     

      <!-- Success message  -->
      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>

      <!-- Error message  -->
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Task selection dropdown -->
      <div class="form-group">
        <label class="label" for="taskSelect">Select a Task</label>
        <select id="taskSelect" class="select" (change)="onTaskSelect($any($event.target).value)">

          <option value="">-- Choose a Task --</option>
          <option *ngFor="let task of tasks" [value]="task._id">{{ task.title }}</option>
        </select>
      </div>

      <!-- Task edit form, shown only if a task is selected -->
      <form [formGroup]="taskForm" *ngIf="taskForm" (ngSubmit)="onSubmit()">
        <!-- Title input -->
        <div class="form-group">
          <label class="label">Title</label>
          <input
            class="input"
            formControlName="title"
            type="text"
            placeholder="Title"
          />
          <!-- Validation message for title -->
          <div *ngIf="taskForm.controls['title'].invalid && taskForm.controls['title'].touched" style="color:red">
            Title is required and must be at least 10 characters.
          </div>
        </div>

        <!-- Description textarea -->
        <div class="form-group">
          <label class="label">Description</label>
          <textarea class="textarea" formControlName="description" placeholder="Description"></textarea>
        </div>

        <!-- Due Date input -->
        <div class="form-group">
          <label class="label">Due Date</label>
          <input class="input" formControlName="dueDate" type="date" />
        </div>

        <!-- Priority select -->
        <div class="form-group">
          <label class="label">Priority</label>
          <select class="select" formControlName="priority">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <!-- Status select -->
<div class="form-group">
  <label class="label">Status</label>
  <select class="select" formControlName="status">
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
</div>

        <!-- Project ID input -->
        <div class="form-group">
          <label class="label">Project ID</label>
          <input
            class="input"
            formControlName="projectId"
            type="number"
            placeholder="Project ID"
            min="1"
          />
          <!-- Validation message for projectId -->
          <div *ngIf="taskForm.controls['projectId'].invalid && taskForm.controls['projectId'].touched" style="color:red">
            Project ID must be a valid number.
          </div>
        </div>

        <!-- Submit button (update) -->
        <button class="button" type="submit" [disabled]="taskForm.invalid">Update Task</button>

        <!-- Delete button -->
        <button
          class="button"
          type="button"
          style="background-color: red; margin-top: 10px;"
          (click)="deleteTask()"
          [disabled]="!selectedTaskId"
        >
          Delete Task
        </button>
      </form>
    </div>

<br />
<br />


<div class = "tasklist-container"> 

<h2 style="text-align:center;">Task List</h2>
      <table class="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Project ID</th>
    
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
</div>

  `,
  styles: [
    `
      .container {
        max-width: 500px;
        margin: 20px auto;
        font-family: Arial, sans-serif;
        background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(2,3,5,0.5);
      }
      .heading {
        text-align: center;
        margin-bottom: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      .label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .input,
      .select,
      .textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .button {
        width: 100%;
        padding: 10px;
        background-color: green;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .button:disabled {
        background-color: #a0c4ff;
        cursor: not-allowed;
      }
      .success-message {
        padding: 10px;
        margin-bottom: 15px;
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        text-align: center;
      }
      .error-message {
        padding: 10px;
        margin-bottom: 15px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        text-align: center;
      }
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
    `,
  ],
})
export class ManageTaskComponent implements OnInit {
  tasks: any[] = [];               // All tasks
  selectedTaskId = '';             // Currently selected task ID
  selectedTask: any = null;        // Selected task details
  taskForm!: FormGroup;            // Form for editing task

  //tasks: Task[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTasks(); // Load tasks on start
  }

  reloadTasks() {
    this.http.get(`${environment.apiBaseUrl}/api/tasks`).subscribe({
      next: (data: any) => {
        this.tasks = data;
      },
      error: (err: any) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }
  

  // Get tasks from server
  loadTasks(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/tasks`).subscribe({
      next: (tasks) => this.tasks = tasks,
      error: () => this.errorMessage = 'Could not load tasks.',
    });
  }

  // When a task is picked
  onTaskSelect(id: string): void {
    this.selectedTaskId = id;

    if (!id) {
      this.selectedTask = null;
      this.taskForm.reset();
      return;
    }

    this.http.get<any>(`${environment.apiBaseUrl}/api/tasks/${id}`).subscribe({
      next: (task) => {
        this.selectedTask = task;
        this.initForm(task);
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Could not load task.';
        this.selectedTask = null;
      },
    });
  }

  // Set up form with task values
  initForm(task: any): void {
    this.taskForm = this.fb.group({
      title: [task.title, [Validators.required, Validators.minLength(10)]],
      description: [task.description || ''],
      dueDate: [task.dueDate?.substring(0, 10) || ''],
      priority: [task.priority || 'Medium', Validators.required],
      status: [task.status || 'Pending', Validators.required],
      projectId: [
        task.projectId ?? '',
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
    });
  }

  // Save changes
  onSubmit(): void {
    if (!this.taskForm.valid || !this.selectedTaskId) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const updatedTask = {
      ...this.taskForm.value,
      projectId: Number(this.taskForm.value.projectId),
    };

    this.http.put(`${environment.apiBaseUrl}/api/tasks/${this.selectedTaskId}`, updatedTask).subscribe({
      next: () => {
        this.successMessage = `Task "${updatedTask.title}" updated.`;
        this.errorMessage = null;
        this.taskUpdated.emit(updatedTask);

        setTimeout(() => this.successMessage = null, 3000);

        this.loadTasks();
        this.taskForm.reset();
        this.selectedTask = null;
        this.selectedTaskId = '';
      },
      error: () => {
        this.errorMessage = 'Update failed.';
        this.successMessage = null;
      },
    });
  }

  // Delete selected task
  deleteTask(): void {
    if (!this.selectedTaskId) return;

    const confirmed = confirm(`Delete "${this.selectedTask?.title}"?`);
    if (!confirmed) return;

    this.http.delete(`${environment.apiBaseUrl}/api/tasks/${this.selectedTaskId}`).subscribe({
      next: () => {
        this.successMessage = `Task "${this.selectedTask?.title}" deleted.`;
        this.errorMessage = null;
        this.taskDeleted.emit(this.selectedTaskId);

        this.selectedTask = null;
        this.selectedTaskId = '';
        this.taskForm.reset();

        setTimeout(() => this.successMessage = null, 3000);
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Delete failed.';
        this.successMessage = null;
      },
    });
  }
}
