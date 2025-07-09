import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, NavigationEnd, Router } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';

@Component({
selector: 'app-layout',
standalone: true,
imports: [RouterLink,RouterOutlet,RouterLinkActive,NgIf],
template: `


 <div class="container">

<!-- Header -->
<header class="header">
<h1> Task Management System</h1>
</header>

<div class="main-content">

<!-- Navigation -->
<nav class="sidebar">
<!-- routerLinkActiveOptions with exact: true , means the active class is only applied when the URL matatches the link  
 Applied on side navigation for the active page-->
<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
<a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>


<div>
<a (click)="toggleProjectsMenu()" style="cursor:pointer;" routerLink="/projects" routerLinkActive="active" >Projects</a>
<!-- Sub navigation for Projects -->
 <div class="sub-menu" *ngIf="isProjectsMenuOpen">
  <a routerLink="/projects/create" routerLinkActive="active" >Create Projects</a>
  <a routerLink="/projects/manage" routerLinkActive="active" >Manage Projects</a>
 </div>
</div>


<div>

<a (click)="toggleTasksMenu()" style="cursor:pointer;" routerLink="/tasks" routerLinkActive="active" >Tasks</a>
<!-- Sub navigation for Tasks -->
 <div class="sub-menu" *ngIf="isTasksMenuOpen">
  <a routerLink="/tasks/list" routerLinkActive="active" >List Tasks</a>
  <a routerLink="/tasks/create" routerLinkActive="active" >Create Tasks</a>
  <a routerLink="/tasks/manage" routerLinkActive="active" >Manage Tasks</a>
 </div>
</div>


</nav> <!-- End of navigation-->

<!--  Content window-->
<section class="content-window">
<router-outlet></router-outlet> <!-- Content from ...component.ts will appear-->
</section> 

</div> <!--End of main-content-->


<!-- Footer -->
<footer class="footer">
<p>©2025 Web450-Task Management System</p>
</footer><!-- End of footer-->


 </div><!--End of container-->

`,
styles: `
.container { 
  display: flex; 
  flex-direction: column; 
  height: 100vh; 
} 
 
.header, .footer { 
  background-color: #3f51b5; 
  color: white; 
  padding: 1rem; 
  text-align: center; 
} 
 
.main-content { 
  display: flex; 
  flex: 1; 
  min-height: 0; /* For proper flex behavior */ 
} 
 
.content-window { 
  flex: 1; 
  padding: 1rem; 
  overflow-y: auto; 
} 
 
/* Navigation styles*/
.sidebar { 
  width: 200px; 
  background-color: #f4f4f4; 
  box-shadow: 2px 0 5px rgba(0,0,0,0.1); 
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
} 

.sidebar a{ 
  display: block;
  padding: 10px 15px;
  margin-bottom: 10px;
  text-decoration: none;
  color: #333;
} 
.sidebar a:hover{ 
  background-color: #3f51b5;
  color: #fff;
} 
.sidebar a.active { 
  background-color: #3f51b5;
  color: #fff;
} 

.sidebar .sub-menu{
  padding-left: 15px;
  margin-top: 5px;
}
.sidebar .sub-menu a{
  padding-left: 8px 15px;
  font-size: 0.9em;
}
`
})

export class LayoutComponent implements OnInit {
  isTasksMenuOpen = false;
  isProjectsMenuOpen = false;
  showTopTaskList = true;

  constructor(private router: Router) {}

  toggleTasksMenu() {
    this.isTasksMenuOpen = !this.isTasksMenuOpen;
  }

  toggleProjectsMenu() {
    this.isProjectsMenuOpen = !this.isProjectsMenuOpen;
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
   
      this.showTopTaskList = !event.urlAfterRedirects.includes('/tasks/list');
    });
  }
}