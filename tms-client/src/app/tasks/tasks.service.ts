// tms-client/src/app/tasks/tasks.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  dateCreated: string;
  dateModified: string;
  projectId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = `/api/tasks`;

  constructor(private http: HttpClient) { }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Get task by ID
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Update a task
  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Delete a task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search tasks with optional filters
  searchTasks(filters: { q?: string; dueDate?: string; priority?: string }): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { params: filters });
  }
}