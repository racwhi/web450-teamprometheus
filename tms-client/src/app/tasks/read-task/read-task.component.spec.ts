// src/app/tasks/read-task/read-task.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ReadTaskComponent } from './read-task.component';
import { TasksService, Task } from '../tasks.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ReadTaskComponent', () => {
  let fixture: ComponentFixture<ReadTaskComponent>;
  let component: ReadTaskComponent;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;

  const mockTasks: Task[] = [
    { _id: 'a1', title: 'Task A', description: 'Desc A', status: 'Done', priority: 'Low', dateCreated: '', dateModified: '', projectId: 1 },
    { _id: 'b2', title: 'Task B', description: 'Desc B', status: 'Pending', priority: 'High', dateCreated: '', dateModified: '', projectId: 2 }
  ];
  const mockTask: Task = { _id: 'a1', title: 'Task A', description: 'Desc A', status: 'Done', priority: 'Low', dateCreated: '', dateModified: '', projectId: 1 };

  beforeEach(async () => {
    tasksServiceSpy = jasmine.createSpyObj('TasksService', ['getTasks', 'getTaskById']);
    tasksServiceSpy.getTasks.and.returnValue(of(mockTasks));
    tasksServiceSpy.getTaskById.and.returnValue(of(mockTask));

    await TestBed.configureTestingModule({
      imports: [ReadTaskComponent, CommonModule, FormsModule],
      providers: [
        { provide: TasksService, useValue: tasksServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load tasks into the dropdown', () => {
    expect(tasksServiceSpy.getTasks).toHaveBeenCalled();
    const options = fixture.nativeElement.querySelectorAll('select option');
    // one placeholder plus two tasks
    expect(options.length).toBe(3);
    expect(options[1].textContent.trim()).toBe('Task A');
    expect(options[2].textContent.trim()).toBe('Task B');
  });

  it('should call getTaskById when a task is selected', fakeAsync(() => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    tick();
    expect(tasksServiceSpy.getTaskById).toHaveBeenCalledWith('a1');
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('.task-card h3');
    expect(card.textContent.trim()).toBe('Task A');
  }));

  it('should show "Task not found" on 404 error', fakeAsync(() => {
    tasksServiceSpy.getTaskById.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    component.loadTask('a1');
    tick();
    fixture.detectChanges();
    expect(component.error).toBe('Task not found');
    expect(fixture.nativeElement.querySelector('.error').textContent.trim()).toBe('Task not found');
  }));

  it('should show generic error message on other errors', fakeAsync(() => {
    tasksServiceSpy.getTaskById.and.returnValue(throwError(() => new Error('fail')));
    component.loadTask('a1');
    tick();
    fixture.detectChanges();
    expect(component.error).toBe('Failed to load task');
    expect(fixture.nativeElement.querySelector('.error').textContent.trim()).toBe('Failed to load task');
  }));
});
