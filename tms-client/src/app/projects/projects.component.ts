import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectsService, Project } from './projects.service';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <p>
    <router-outlet></router-outlet>
    </p>
  `,
  styles: ``
})
export class ProjectsComponent {

}
