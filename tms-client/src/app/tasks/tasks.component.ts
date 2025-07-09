import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { TasksService, Task } from './tasks.service';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
   
    <router-outlet></router-outlet>
  `,
  styles: [`
    
  `]
})
export class TasksComponent  {}
