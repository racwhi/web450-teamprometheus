import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProjectsService, Project } from '../projects.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-projects',
  standalone: true,
 imports: [CommonModule, HttpClientModule],
  template: `
    <div class="list-container">
      <h2>All Projects</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <ng-container *ngIf="projects.length; else noProjects">
        <table class="project-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
          <!--    <th>Date Created</th>
              <th>Date Modified</th> -->
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let project of projects">
              <td>{{ project.projectId }}</td>
              <td>{{ project.name }}</td>
              <td>{{ project.description || 'N/A' }}</td>
              <td>{{ project.startDate ? (project.startDate | date:'mediumDate') : 'N/A' }}</td>
              <td>{{ project.endDate ? (project.endDate | date:'mediumDate') : 'N/A' }}</td>
           <!--   <td>{{ project.dateCreated ? (project.dateCreated | date:'medium') : 'N/A' }}</td>
              <td>{{ project.dateModified ? (project.dateModified | date:'medium') : 'N/A' }}</td>-->
            </tr>
          </tbody>
        </table>
      </ng-container>
      <ng-template #noProjects>
        <p>No projects found.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .list-container {
      max-width: 1000px;
      margin: 2rem auto;
      font-family: Arial, sans-serif;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    .error {
      color: #e74c3c;
      text-align: center;
      margin-bottom: 1rem;
    }
    .project-table {
      width: 100%;
      border-collapse: collapse;
    }
    .project-table th, .project-table td {
      padding: 0.75rem;
      border: 1px solid #ddd;
      text-align: left;
    }
    .project-table thead {
      background-color: #3f51b5;
      color: white;
    }
  `]
})
export class ListProjectsComponent implements OnInit {
  projects: Project[] = [];
 
error: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>(`${environment.apiBaseUrl}/api/projects`).subscribe({
      next: (projects) => this.projects = projects,
      error: () => this.error= 'Could not load projects.',
    });
  }
}
