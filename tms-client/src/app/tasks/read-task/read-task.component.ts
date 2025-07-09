import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-read-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './read-task.component.html',
  styleUrl: './read-task.component.css'
})
export class ReadTaskComponent implements OnInit {
  task: Task | null = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tasksService.getTaskById(id).subscribe({
        next: data => this.task = data,
        error: err => {
          console.error('Error loading task:', err);
          this.error = 'Failed to load task';
        }
      });
    }
  }
}