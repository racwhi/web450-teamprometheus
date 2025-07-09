import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadTaskComponent } from './read-task.component';
import { TasksService } from '../tasks.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('ReadTaskComponent', () => {
  let component: ReadTaskComponent;
  let fixture: ComponentFixture<ReadTaskComponent>;
  let mockTasksService: Partial<TasksService>;

  beforeEach(async () => {
    // A minimal mock of your TasksService
    mockTasksService = {
      getTaskById: (id: string) => of({
        _id: id,
        title: 'Mock Title',
        description: 'Mock desc',
        status: 'Pending',
        priority: 'Low',
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        projectId: 1001
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReadTaskComponent,
        RouterTestingModule  
      ],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '123' })
            },
            params: of({ id: '123' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the task on init', () => {
    expect(component.task).toBeTruthy();

    expect(component.task!._id).toBe('123');
    expect(component.task!.title).toBe('Mock Title');
  });
});
