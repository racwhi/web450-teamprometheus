import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { ManageTaskComponent } from './manage-task.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('ManageTaskComponent', () => {
  let component: ManageTaskComponent;
  let fixture: ComponentFixture<ManageTaskComponent>;
  let httpMock: HttpTestingController;

  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Desc',
    dueDate: '2025-07-20',
    priority: 'High',
    status: 'Pending',
    projectId: 101,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ManageTaskComponent, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTaskComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Mock the GET request from loadTasks() in ngOnInit
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/task`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  afterEach(() => {
    httpMock.verify(); // Confirm no outstanding requests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.initForm({
      title: '',
      description: '',
      dueDate: '',
      priority: '',
      status: '',
      projectId: ''
    });
    fixture.detectChanges();
    expect(component.taskForm.invalid).toBeTrue();
  });

  it('should reset form and selected task when no task is selected', () => {
    component.initForm({
      title: 'Test Title 123',
      description: 'Some description',
      dueDate: '2025-07-20',
      priority: 'High',
      status: 'Pending',
      projectId: '101',
    });
    fixture.detectChanges();

    component.selectedTaskId = '1';
    component.selectedTask = { title: 'Test Title 123' };

    component.onTaskSelect(''); // Clear selection

    fixture.detectChanges();

    expect(component.selectedTaskId).toBe('');
    expect(component.selectedTask).toBeNull();
    expect(component.taskForm.pristine || component.taskForm.untouched).toBeTrue();
  });

  it('should load a selected task from API', fakeAsync(() => {
    component.onTaskSelect('1');

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/task/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);

    tick();// simulates passing of time in tests. Helps test async code without waiting in real time.
    fixture.detectChanges();

    expect(component.selectedTask.title).toBe('Test Task');
    expect(component.taskForm.value.title).toBe('Test Task');
  }));

  
});
