import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TasksService } from './tasks.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TasksComponent UI', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent, HttpClientTestingModule], 
      providers: [TasksService],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title "Task List" in an h2 tag', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2?.textContent).toContain('Task List');
  });

  it('should render a table with class "task-table"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table.task-table');
    expect(table).toBeTruthy();
  });
});
