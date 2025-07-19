// src/app/tasks/search-tasks/search-tasks.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-search-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="search-container">
      <h2>Search Tasks</h2>

      <!-- Wrap filters and inputs in a form for (ngSubmit) -->
      <form class="search-box" (ngSubmit)="onSearch()">
        <div class="filters">
          <input
          class="search-input"
          type="text"
          [(ngModel)]="query"
          name="query"
          placeholder="Enter keyword or 24‑char ID…"
        />
        <button type="submit" class="search-button" (click)="onSearch()">Search</button>
          <div class="filter-item">
            <label for="due">Due by:</label>
            <input id="due" name="dueDate" type="date" [(ngModel)]="dueDateFilter" class="filter-input" />
          </div>

          <div class="filter-item">
            <label for="priority">Priority:</label>
            <select id="priority" name="priority" [(ngModel)]="priorityFilter" class="filter-input">
              <option value="">Any</option>
              <option *ngFor="let p of priorities" [value]="p">{{ p }}</option>
            </select>
          </div>
        </div>

        
      </form>

      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="loading" class="loading">Searching…</div>

      <ul *ngIf="!loading && results.length">
        <li *ngFor="let t of results">
          <a href="#" (click)="viewTask(t._id); $event.preventDefault()">
            {{ t.title }} <small>({{ t._id }})</small>
          </a>
        </li>
      </ul>

      <div *ngIf="!loading && searched && !results.length" class="no-results">
        No tasks found matching “{{ query }}”
      </div>

      <div *ngIf="selectedTask" class="task-card">
        <h3>{{ selectedTask.title }}</h3>
        <p><strong>Description:</strong> {{ selectedTask.description || 'N/A' }}</p>
        <p><strong>Status:</strong> {{ selectedTask.status }}</p>
        <p><strong>Priority:</strong> {{ selectedTask.priority }}</p>
        <p *ngIf="selectedTask.dueDate">
          <strong>Due Date:</strong> {{ selectedTask.dueDate | date:'mediumDate' }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 600px;
      margin: 2rem auto;
      font-family: Arial, sans-serif;
      padding: 1rem;
      background: #fdfdfd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    h2 {
      text-align: center;
      margin-bottom: 1rem;
      color: #333;
    }

    form.search-box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .filter-input, .search-input, .search-button {
      height: 2.5rem;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .filter-input {
      padding: 0 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .search-input {
      flex: 1 1 auto;
      min-width: 150px;
      padding: 0 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: #3498db;
      outline: none;
    }

    .search-button {
      padding: 0 1rem;
      font-size: 1rem;
      background: #3498db;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }

    .search-button:hover {
      background: #2980b9;
      transform: translateY(-1px);
    }

    .error {
      color: #e74c3c;
      text-align: center;
      margin-bottom: 1rem;
      font-weight: bold;
    }

    .loading {
      text-align: center;
      font-style: italic;
      color: #777;
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem;
    }

    ul li {
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: box-shadow 0.2s, transform 0.1s;
    }

    ul li:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    ul a {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }

    ul a:hover {
      text-decoration: underline;
    }

    .no-results {
      text-align: center;
      color: #555;
      margin-bottom: 1rem;
    }

    .task-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1rem;
      margin-top: 1rem;
      transition: box-shadow 0.2s, transform 0.1s;
    }

    .task-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      transform: translateY(-2px);
    }

    .task-card h3 {
      margin-top: 0;
      color: #333;
    }

    .task-card p {
      margin: 0.5rem 0;
      color: #555;
    }
  `]
})
export class SearchTasksComponent {
  query = '';
  results: Task[] = [];
  selectedTask: Task | null = null;
  error = '';
  searched = false;
  loading = false;

  dueDateFilter = '';
  priorityFilter = '';
  priorities = ['High', 'Medium', 'Low'];

  private objectIdPattern = /^[0-9a-fA-F]{24}$/;

  constructor(private tasksService: TasksService) {}

  onSearch(): void {
    this.error = '';
    this.selectedTask = null;
    this.results = [];
    this.searched = true;
    this.loading = true;

    const filters: any = {};
    if (this.query.trim()) {
      filters.q = this.query.trim();
    }
    if (this.dueDateFilter) {
      filters.dueDate = new Date(this.dueDateFilter).toISOString().split('T')[0];
    }
    if (this.priorityFilter) {
      filters.priority = this.priorityFilter;
    }

    if (!filters.q && !filters.dueDate && !filters.priority) {
      this.error = 'Please enter a keyword, select a due date or a priority.';
      this.loading = false;
      return;
    }

    if (
      Object.keys(filters).length === 1 &&
      filters.q &&
      this.objectIdPattern.test(filters.q)
    ) {
      this.tasksService.getTaskById(filters.q).subscribe({
        next: task => {
          this.results = [task];
          this.selectedTask = task;
          this.loading = false;
        },
        error: err => {
          this.error = err.status === 404
            ? `No task found with ID ${filters.q}`
            : 'Error fetching task by ID';
          this.loading = false;
        }
      });
      return;
    }

    this.tasksService.searchTasks(filters).subscribe({
      next: list => {
        this.results = list;
        this.loading = false;
      },
      error: () => {
        this.error = 'Search failed. Please try again.';
        this.loading = false;
      }
    });
  }

  viewTask(id: string): void {
    this.error = '';
    this.tasksService.getTaskById(id).subscribe({
      next: t => (this.selectedTask = t),
      error: err => {
        this.error = err.status === 404
          ? 'Task not found'
          : 'Failed to load task details';
      }
    });
  }
}
