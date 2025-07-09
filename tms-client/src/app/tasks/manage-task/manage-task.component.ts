
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
    <div class="container">
      <h2 class="heading">Manage Task</h2>

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
  `,
  styles: [
    `
      .container {
        max-width: 500px;
        margin: 20px auto;
        font-family: Arial, sans-serif;
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
    `,
  ],
})
export class ManageTaskComponent implements OnInit {
  // List of all tasks loaded from backend
  tasks: any[] = [];

  // Selected task id from dropdown
  selectedTaskId: string = '';

  // Selected task object loaded from backend
  selectedTask: any = null;

  // Reactive form group for editing task details
  taskForm!: FormGroup;

  // Success and error message strings for user interface feedback
  successMessage: string | null = null;
  errorMessage: string | null = null;

  //Output events for parent components
  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<string>();

  // Inject FormBuilder and HttpClient services
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Load all tasks on component init
    this.loadTasks();
  }

  // Load all tasks from API
  loadTasks(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/task`).subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: () => (this.errorMessage = 'Failed to load tasks.'),
    });
  }

  // Called when a task is selected from dropdown
  onTaskSelect(id: string): void {
    this.selectedTaskId = id;

    // If no selection, clear form and task
    if (!id) {
      this.selectedTask = null;
      this.taskForm.reset();
      return;
    }

    // Fetch task details by id
    this.http.get<any>(`${environment.apiBaseUrl}/api/task/${id}`).subscribe({
      next: (task) => {
        this.selectedTask = task;
        // Initialize reactive form with task data
        this.initForm(task);
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load selected task.';
        this.selectedTask = null;
      },
    });
  }

  // Initialize reactive form with validation and current task values
  initForm(task: any): void {
    this.taskForm = this.fb.group({
      title: [task.title, [Validators.required, Validators.minLength(10)]],
      description: [task.description || ''],
      dueDate: [task.dueDate ? task.dueDate.substring(0, 10) : ''], 
      priority: [task.priority || 'Medium', Validators.required],
      status: [task.status || 'Pending', Validators.required],
      projectId: [
        task.projectId ?? '',
        [Validators.required, Validators.pattern(/^\d+$/)], // digits only pattern validation
      ],
    });
  }

  // Form submit  for updating task
  onSubmit(): void {
    // Validate form and task selected
    if (!this.taskForm.valid || !this.selectedTaskId) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // Convert projectId string to number explicitly
    const updatedTask = {
      ...this.taskForm.value,// Copy all properties from the form
      projectId: Number(this.taskForm.value.projectId) //convert projectID from string to number
    };

    // Call API to update task
    this.http
      .put(`${environment.apiBaseUrl}/api/task/${this.selectedTaskId}`, updatedTask)
      .subscribe({
        next: () => {
          // Show success message
          this.successMessage = `Task "${updatedTask.title}" updated successfully.`;
          this.errorMessage = null;

          // Emit event to parent if needed
          this.taskUpdated.emit(updatedTask);

          // Clear success message after 3 seconds
          setTimeout(() => (this.successMessage = null), 3000);

          // Refresh the task list to show updates
          this.loadTasks();


           // Clear form and selected task after update
        this.taskForm.reset();
        this.selectedTask = null;
        this.selectedTaskId = '';
        },
        error: () => {
          this.errorMessage = 'Failed to update task.';
          this.successMessage = null;
        },
      });
  }

   
  // Delete selected task after confirmation
  deleteTask(): void {
    if (!this.selectedTaskId) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${this.selectedTask?.title}"?`
    );
    if (!confirmed) return;

    this.http.delete(`${environment.apiBaseUrl}/api/task/${this.selectedTaskId}`).subscribe({
      next: () => {
        this.successMessage = `Task "${this.selectedTask?.title}" deleted successfully.`;
        this.errorMessage = null;

        // Emit event to parent if needed
        this.taskDeleted.emit(this.selectedTaskId);

        // Clear form and selection
        this.selectedTask = null;
        this.selectedTaskId = '';
        this.taskForm.reset();

        // Clear success message after 3 seconds
        setTimeout(() => (this.successMessage = null), 3000);

        // Reload updated task list
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Failed to delete task.';
        this.successMessage = null;
      },
    });
  }
}
