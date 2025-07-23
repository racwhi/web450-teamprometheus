// tms-client/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { ManageTaskComponent } from './tasks/manage-task/manage-task.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { ManageProjectComponent } from './projects/manage-project/manage-project.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ListTasksComponent } from './tasks/list-tasks/list-tasks.component';
import { ReadTaskComponent } from './tasks/read-task/read-task.component';
import { SearchTasksComponent } from './tasks/search-tasks/search-tasks.component';
import { ListProjectsComponent } from './projects/list-projects/list-projects.component';

//export routes
export const routes: Routes = [
{
path: '',
component: LayoutComponent,
 children: [
{
path: '',component: HomeComponent
},
{
path: 'tasks',
component: TasksComponent,
children:[
  {path: 'list', component:ListTasksComponent},
    {path: 'create', component:CreateTaskComponent},
     {path: 'manage', component:ManageTaskComponent},
    {path: 'read', component:ReadTaskComponent},
    {path: 'search', component: SearchTasksComponent},
     {path:'', redirectTo:'list',pathMatch: 'full' }//default to list
     
]
},
{
path: 'projects',
component: ProjectsComponent,
children:[
    {path: 'list', component:ListProjectsComponent},
    {path: 'create', component:CreateProjectComponent},
     {path: 'manage', component:ManageProjectComponent},
     { path: 'projects/create', component: CreateProjectComponent },
     {path:'', redirectTo:'list',pathMatch: 'full' }//default to list
]
}


] 
}
];
