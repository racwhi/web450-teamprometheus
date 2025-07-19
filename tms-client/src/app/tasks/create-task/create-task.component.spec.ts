import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTaskComponent } from './create-task.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { By } from '@angular/platform-browser';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    // Mock the GET /api/task call
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // return empty task list
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // ensure no pending requests
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading "Create New Task"', () => {
    const headingEl = fixture.debugElement.query(By.css('h2.heading')).nativeElement;
    expect(headingEl.textContent).toContain('Create New Task');
  });

  it('should render the task list table with h2 title "Task List"', () => {
    const tableHeading = fixture.debugElement.query(By.css('.tasklist-container h2'))?.nativeElement;
    expect(tableHeading).toBeTruthy();
    expect(tableHeading.textContent).toContain('Task List');

    const table = fixture.debugElement.query(By.css('table.task-table'));
    expect(table).toBeTruthy();
  });


it('should mark title as invalid if empty or too short', () => {
    const titleControl = component.taskForm.controls['title'];
    titleControl.setValue('');
    expect(titleControl.invalid).toBeTrue();

    titleControl.setValue('short');
    expect(titleControl.invalid).toBeTrue();

    titleControl.setValue('Long enough title');
    expect(titleControl.valid).toBeTrue();
  });





it('should use environment.apiBaseUrl for GET /api/tasks', () => {
  const expectedUrl = `${environment.apiBaseUrl}/api/tasks`;

  component.reloadTasks(); // triggers the GET call

  const req = httpMock.expectOne(expectedUrl);
  expect(req.request.method).toBe('GET');

  req.flush([]); // respond with empty data
});

it('should disable submit button if form is invalid', () => {
  // Set form values to be invalid
  component.taskForm.setValue({
    title: '',  // Invalid title
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    projectId: '1'
  });

  fixture.detectChanges();  // Trigger change detection

  const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

  // Check if the submit button is disabled
  expect(submitButton.disabled).toBeTrue();
});





});

