import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListTasksComponent } from './list-tasks.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TasksService , Task} from '../tasks.service';
import { of, throwError } from 'rxjs';

describe('ListTasksComponent', () => {
  let component: ListTasksComponent;
  let fixture: ComponentFixture<ListTasksComponent>;
  let taskService: TasksService;

  const mockTasks: Task[] = [
    {
      _id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      status: 'Open',
      priority: 'High',
      dueDate: '2025-07-10',
      dateCreated: '2025-07-01',
      dateModified: '2025-07-01',
      projectId: 101
    },
    {
      _id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '2025-07-15',
      dateCreated: '2025-07-02',
      dateModified: '2025-07-02',
      projectId: 102
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListTasksComponent,HttpClientTestingModule],//ListTasksComponent is standalone, so import directly into imports
    //  declarations: [ListTasksComponent],
      providers: [TasksService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTasksComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TasksService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks successfully on init', () => {
    spyOn(taskService, 'getTasks').and.returnValue(of(mockTasks));

   component.ngOnInit();


    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
    expect(component.tasks[0].title).toBe('Test Task 1');
  });

  it('should handle errors when fetching tasks', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(taskService, 'getTasks').and.returnValue(throwError(() => new Error('Server error')));

    
    component.ngOnInit();

    expect(taskService.getTasks).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching tasks:', jasmine.any(Error));
  });
});
