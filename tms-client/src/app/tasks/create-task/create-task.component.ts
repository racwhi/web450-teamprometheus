import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TasksService, Task } from '../tasks.service';


@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
   <div class="create-container">
      <h2 class="heading">Create New Task</h2>

      <!-- Success message -->
      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Error message -->
      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form [formGroup]="taskForm" class="form" (ngSubmit)="onSubmit()">

        <!-- Title -->
        <div class="form-group">
          <label class="label">Title:</label>
          <input class="input" formControlName="title" placeholder="Enter task title" required />
          <div *ngIf="taskForm.controls['title'].invalid && taskForm.controls['title'].touched" style="color:red">
            Title is required and must be at least 10 characters
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="label">Description:</label>
          <textarea class="textarea" formControlName="description" rows="3" placeholder="Enter task description"></textarea>
        </div>

        <!-- Status -->
        <div class="form-group">
          <label class="label">Status:</label>
          <select class="select" formControlName="status">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <!-- Priority -->
        <div class="form-group">
          <label class="label">Priority:</label>
          <select class="select" formControlName="priority">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <!-- Due Date -->
        <div class="form-group">
          <label class="label">Due Date:</label>
          <input type="date" class="input" formControlName="dueDate" />
        </div>

        <!-- Project ID -->
        <div class="form-group">
          <label class="label">Project ID:</label>
          <!-- Changed to type="number" -->
          <input
            type="number"
            class="input"
            formControlName="projectId"
            placeholder="Enter Project ID"
            required
            min="1"
          />
          <div *ngIf="taskForm.controls['projectId'].invalid && taskForm.controls['projectId'].touched" style="color:red">
            Project ID must be a valid number
          </div>
        </div>

        <!-- Submit Button -->
        <button class="button" type="submit" [disabled]="taskForm.invalid">Save Task</button>
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
    .create-container {
      max-width: 500px;
      margin: 20px auto;
      font-family: Arial, sans-serif;
    }
    .heading {
      text-align: center;
      margin-bottom: 20px;
    }
    .form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(2,3,5,0.5);
    }
    .form-group {
      margin-bottom: 15px;
    }
    .label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .input, .select, .textarea {
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
    `
  ]
})
export class CreateTaskComponent implements OnInit {
  taskForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(10)]],  
    description: [''],
    status: ['Pending', Validators.required],
    priority: ['Medium', Validators.required],
    dueDate: [''],
    //  pattern validator to only allow numbers (digits only)
    projectId: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
  });

   tasks: Task[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  @Output() taskCreated = new EventEmitter<any>();
  tasksService: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
        this.reloadTasks();
  }
  reloadTasks() {
    this.http.get(`${environment.apiBaseUrl}/api/task`).subscribe({
      next: (data: any) => {
        this.tasks = data;
      },
      error: (err: any) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }
  

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // Convert projectId string to number ,// Convert projectId from string to number
    const newTask = {
      ...this.taskForm.value,// Copy all properties from the form
      projectId: Number(this.taskForm.value.projectId) //convert projectID from string to number
    };

 this.http.post(`${environment.apiBaseUrl}/api/task`, newTask).subscribe({     
   next: (createdTask) => {
        this.successMessage = `Task "${newTask.title}" created successfully!`;
        this.errorMessage = null;

        this.taskForm.reset({
          status: 'Pending',
          priority: 'Medium'
        });

        this.taskCreated.emit(createdTask);

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to create task. Please try again.';
        this.successMessage = null;
      }
    });
  }
}
