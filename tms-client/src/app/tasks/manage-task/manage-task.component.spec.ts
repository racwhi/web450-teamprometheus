import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

    // Mock the initial GET request from loadTasks() in ngOnInit
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush([]);  // Mock an empty response 
  });

  afterEach(() => {
    httpMock.verify(); // Confirm no outstanding requests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header', () => {
  const headerElement = fixture.nativeElement.querySelector('h2');
  expect(headerElement).toBeTruthy();  // Verifies the header element exists
  expect(headerElement.textContent).toContain('Manage Task');  // Verifies the header text
});

it('should render task list', () => {
  // Simulating a list of tasks being fetched
  component.tasks = [
    { _id: '1', title: 'Test Task 1', description: 'Desc 1', dueDate: '2025-07-20', priority: 'High', status: 'Pending', projectId: 101 },
    { _id: '2', title: 'Test Task 2', description: 'Desc 2', dueDate: '2025-07-21', priority: 'Low', status: 'Completed', projectId: 102 },
  ];
  fixture.detectChanges();  // Update the view

  const taskRows = fixture.nativeElement.querySelectorAll('tr');
  expect(taskRows.length).toBe(3);  // The first row is the header, so we expect 2 task rows below it
  expect(taskRows[1].textContent).toContain('Test Task 1');  // Check for the first task
  expect(taskRows[2].textContent).toContain('Test Task 2');  // Check for the second task
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


  

  it('should not submit when form is invalid', () => {
    component.selectedTaskId = '1';
    component.initForm({
      title: 'short',  // invalid (less than 10 chars)
      description: '',
      dueDate: '',
      priority: 'High',
      status: 'Pending',
      projectId: 101,
    });
    fixture.detectChanges();

    spyOn(component.taskForm, 'markAllAsTouched');

    component.onSubmit();

    httpMock.expectNone(`${environment.apiBaseUrl}/api/tasks/1`);
    expect(component.taskForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should set errorMessage on update failure', (done) => {
    component.selectedTaskId = '1';
    component.initForm({
      title: 'Valid task title',
      description: 'Desc',
      dueDate: '2025-07-20',
      priority: 'High',
      status: 'Pending',
      projectId: 101,
    });
    fixture.detectChanges();

    component.onSubmit();

    // update task  failure mockup
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tasks/1`);
    req.flush('error', { status: 500, statusText: 'Server Error' });

    setTimeout(() => {
      expect(component.errorMessage).toBe('Update failed.');
      expect(component.successMessage).toBeNull();
      done();
    }, 0);
  });
});
