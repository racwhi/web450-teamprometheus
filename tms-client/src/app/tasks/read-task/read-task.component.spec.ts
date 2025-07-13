// src/app/tasks/read-task/read-task.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ReadTaskComponent } from './read-task.component';
import { TasksService, Task } from '../tasks.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ReadTaskComponent', () => {
  let fixture: ComponentFixture<ReadTaskComponent>;
  let component: ReadTaskComponent;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;
  const mockTask: Task = {
    _id: 'abc123',
    title: 'Test Task',
    description: 'A task for testing',
    status: 'Pending',
    priority: 'High',
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    projectId: 123
  };


  function initComponentWith(
    getByIdReturn: any,
    paramId: string | null = 'abc123'
  ) {
    tasksServiceSpy = jasmine.createSpyObj('TasksService', ['getTaskById']);
    tasksServiceSpy.getTaskById.and.returnValue(getByIdReturn);

    TestBed.configureTestingModule({
      imports: [ ReadTaskComponent ],
      providers: [
        { provide: TasksService, useValue: tasksServiceSpy },
        { provide: ActivatedRoute, useValue: {
            snapshot: { paramMap: { get: () => paramId } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should display task details when service returns a task', () => {
    initComponentWith(of(mockTask));

    const compiled = fixture.nativeElement as HTMLElement;
    expect(tasksServiceSpy.getTaskById).toHaveBeenCalledWith('abc123');
    expect(component.task).toEqual(mockTask);
    expect(compiled.querySelector('h2')?.textContent)
      .toContain('Task: Test Task');
    expect(compiled.querySelector('p')?.textContent)
      .toContain('A task for testing');
  });

  it('should show "Task not found" on 404 response', () => {
    const notFoundError = new HttpErrorResponse({ status: 404 });
    initComponentWith(throwError(() => notFoundError));

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.error).toBe('Task not found');
    expect(compiled.querySelector('.error')?.textContent)
      .toBe('Task not found');
  });

  it('should show generic error message on other errors', () => {
    initComponentWith(throwError(() => new Error('Server down')));

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.error).toBe('Failed to load task');
    expect(compiled.querySelector('.error')?.textContent)
      .toBe('Failed to load task');
  });
});
