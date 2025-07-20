import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2 class="heading">Manage Project</h2>
    <div class="container">
      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="form-group">
        <label class="label" for="projectSelect">Select a Project</label>
        <select id="projectSelect" class="select" (change)="onProjectSelect($any($event.target).value)">
          <option value="">-- Choose a Project --</option>
          <option *ngFor="let project of projects" [value]="project._id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <form *ngIf="projectForm" [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="label">Project Name</label>
          <input class="input" formControlName="name" type="text" />
          <div *ngIf="projectForm.controls['name'].invalid && projectForm.controls['name'].touched" style="color:red">
            Project name is required.
          </div>
        </div>

        <div class="form-group">
          <label class="label">Description</label>
          <textarea class="textarea" formControlName="description"></textarea>
        </div>

        <div class="form-group">
          <label class="label">Start Date</label>
          <input class="input" type="date" formControlName="startDate" />
        </div>

        <div class="form-group">
          <label class="label">End Date</label>
          <input class="input" type="date" formControlName="endDate" />
        </div>

        <div class="form-group">
          <label class="label">Project ID</label>
          <input class="input" formControlName="projectId" type="number" min="1" />
        </div>

        <button class="button" type="submit" [disabled]="projectForm.invalid">Update Project</button>

        <button
          class="button"
          type="button"
          style="background-color: red; margin-top: 10px;"
          (click)="deleteProject()"
          [disabled]="!selectedProjectId"
        >
          Delete Project
        </button>
      </form>
    </div>

    <br /><br />

    <div class="tasklist-container">
      <h2 style="text-align:center;">Project List</h2>
      <table class="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of projects">
            <td>{{ p.projectId }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.description || 'N/A' }}</td>
            <td>{{ p.startDate | date }}</td>
            <td>{{ p.endDate | date }}</td>
            <td>{{ p.dateCreated | date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
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
    }`
})
export class ManageProjectComponent implements OnInit {
  projects: any[] = [];
  selectedProjectId = '';
  selectedProject: any = null;
  projectForm!: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  @Output() projectUpdated = new EventEmitter<any>();
  @Output() projectDeleted = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/projects`).subscribe({
      next: (data) => this.projects = data,
      error: () => this.errorMessage = 'Could not load projects.'
    });
  }

  onProjectSelect(id: string): void {
    this.selectedProjectId = id;
    if (!id) {
      this.selectedProject = null;
      this.projectForm?.reset();
      return;
    }

    this.http.get<any>(`${environment.apiBaseUrl}/api/projects/${id}`).subscribe({
      next: (project) => {
        this.selectedProject = project;
        this.initForm(project);
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Could not load project.';
        this.selectedProject = null;
      }
    });
  }

  initForm(project: any): void {
    this.projectForm = this.fb.group({
      name: [project.name, Validators.required],
      description: [project.description || ''],
      startDate: [project.startDate?.substring(0, 10) || ''],
      endDate: [project.endDate?.substring(0, 10) || ''],
      projectId: [project.projectId, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (!this.projectForm.valid || !this.selectedProjectId) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const updatedProject = {
      ...this.projectForm.value,
      projectId: Number(this.projectForm.value.projectId)
    };

    this.http.put(`${environment.apiBaseUrl}/api/projects/${this.selectedProjectId}`, updatedProject).subscribe({
      next: () => {
        this.successMessage = `Project "${updatedProject.name}" updated.`;
        this.errorMessage = null;
        this.projectUpdated.emit(updatedProject);

        setTimeout(() => this.successMessage = null, 3000);

        this.loadProjects();
        this.projectForm.reset();
        this.selectedProject = null;
        this.selectedProjectId = '';
      },
      error: () => {
        this.errorMessage = 'Update failed.';
        this.successMessage = null;
      }
    });
  }

  deleteProject(): void {
    if (!this.selectedProjectId) return;

    const confirmed = confirm(`Delete "${this.selectedProject?.name}"?`);
    if (!confirmed) return;

    this.http.delete(`${environment.apiBaseUrl}/api/projects/${this.selectedProjectId}`).subscribe({
      next: () => {
        this.successMessage = `Project "${this.selectedProject?.name}" deleted.`;
        this.errorMessage = null;
        this.projectDeleted.emit(this.selectedProjectId);

        this.selectedProject = null;
        this.selectedProjectId = '';
        this.projectForm.reset();

        setTimeout(() => this.successMessage = null, 3000);
        this.loadProjects();
      },
      error: () => {
        this.errorMessage = 'Delete failed.';
        this.successMessage = null;
      }
    });
  }
}