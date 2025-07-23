import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  projectId?: number;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  mode: 'create' | 'addExisting' | 'addNew' = 'create';

  projectForm!: FormGroup;
  newTaskForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  attachedTasks: Task[] = [];
  allTasks: Task[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectId: [null, Validators.required],
      name: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: ['']
    });

    this.newTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      status: ['Pending', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: ['']
    });

    this.loadExistingTasks();
  }

  setMode(m: 'create' | 'addExisting' | 'addNew'): void {
    this.mode = m;
  }

  loadExistingTasks(): void {
    this.http.get<Task[]>(`${environment.apiBaseUrl}/api/tasks`)
      .subscribe(list => this.allTasks = list);
  }

  attachExistingTask(task: Task): void {
    if (!this.attachedTasks.some(t => t._id === task._id)) {
      this.attachedTasks.push(task);
    }
    this.setMode('create');
  }

  createAndAttachNewTask(): void {
  if (this.newTaskForm.invalid) {
    this.newTaskForm.markAllAsTouched();
    return;
  }
  // grab the numeric projectId the user has already entered
  const pid = this.projectForm.get('projectId')!.value;

  const payload = {
    ...this.newTaskForm.value,
    projectId: pid   // ← send it here
  };

  this.http.post<Task>(`${environment.apiBaseUrl}/api/tasks`, payload)
    .subscribe({
      next: task => {
        this.attachedTasks.push(task);
        this.allTasks.push(task);
        this.newTaskForm.reset({ status: 'Pending', priority: 'Medium' });
        this.setMode('create');
      },
      error: err => {
        console.error('POST /api/tasks failed:', err);
        this.errorMessage = err.error?.message || 'Failed to create task';
      }
    });
  }


  onSubmit(): void {
  if (this.projectForm.invalid) {
    this.projectForm.markAllAsTouched();
    return;
  }

  const payload = {
    ...this.projectForm.value,
    tasks: this.attachedTasks.map(t => t._id)
  };

  this.http
    .post<{ projectId: number }>(
      `${environment.apiBaseUrl}/api/projects`,
      payload
    )
    .subscribe({
      next: project => {
        this.successMessage = 'Project created successfully';
        this.errorMessage   = '';
        this.projectForm.reset();
        this.attachedTasks = [];
        this.newTaskForm.reset({ status: 'Pending', priority: 'Medium' });
        this.loadExistingTasks();
      },
      error: err => {
        console.error('POST /api/projects failed:', err);
        this.errorMessage   = err.error?.message || err.message || 'Project creation failed';
        this.successMessage = '';
      }
    });
}



}