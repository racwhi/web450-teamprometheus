import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
<div class="content-window">
<h3>Welcome to the Task Management System!</h3>
<br>
<p>Mission Statement:  To provide users with a platform to track and 
  manage tasks and projects efficiently. This task management system 
  will be available for various user needs, from personal task
   organization to project management. The goal is to provide an 
   easy-to-use task management system, making task and project 
   management manageable.</p>

<br>
<br>
<br>

  <div class="column">
    <a routerLink="/projects" class="card-link">
    <div class="card">     

      <h2>Projects</h2>
      <br>
      <p>Click Here 
        to start </p>
        <p>creating your projects</p>
        <p>within the</p> 
        <p> Task Management System!</p>

     
    </div>
    </a>
  </div>

  <div class="column">
        <a routerLink="/tasks" class="card-link">

    <div class="card">
      <h2>Tasks</h2>
       <br>
      <p>Click Here 
        to start </p>
        <p>creating your tasks</p>
        <p>within the</p> 
        <p> Task Management System!</p>
     
    </div>
        </a>
  </div>
  
 
    <p class="server-message">Main Content
      <br>
    This is a basic layout for your MEAN stack project.
    <br>
    <strong>Server message:</strong> {{ serverMessage }}</p>
</div>
  `,
  styles: `
  * {
  box-sizing: border-box;
}
p.server-message{
  font-size:0.2em;
}
/* Float two columns side by side */
.column {
  float: left;
  width: 50%;
  padding: 0 5px;
 height: 500px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive columns */
@media screen and (max-width: 600px) {
  .column {
    width: 100%;
    display: block;
    margin-bottom: 5px;
  }
}

/* Style  cards */
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  text-align: center;
  background-color: #f1f1f1;
  height:45vh;

}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: #3f51b5; 
  color:#fff;
}
.card-link{
  text-decoration: none;
  cursor:pointer;
  display: block; /*Make entire card clickable */
}
  `
})
export class HomeComponent {
  serverMessage: string;

  constructor(private http: HttpClient) {
    this.serverMessage = '';

    // Simulate a server request that takes 2 seconds to complete
    setTimeout(() => {
      this.http.get(`${environment.apiBaseUrl}/api`).subscribe({
        next: (res: any) => {
          this.serverMessage = res['message'];
        },
        error: (err) => {
          this.serverMessage = 'Error loading server message';
        }
      });
    }, 2000);
  }
}
