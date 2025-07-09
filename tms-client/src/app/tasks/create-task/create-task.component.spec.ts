import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateTaskComponent } from './create-task.component'; // Adjust path if needed
import { TasksService } from '../tasks.service';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateTaskComponent, // 
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [TasksService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should create the component with default form values', () => {
    expect(component).toBeTruthy();
    expect(component.taskForm.value.status).toBe('Pending');
    expect(component.taskForm.value.priority).toBe('Medium');
  });


  it('should display an h2 heading with text "Create New Task"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe('Create New Task');
  });


  

});
