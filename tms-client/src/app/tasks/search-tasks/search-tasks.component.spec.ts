// tms-client/src/app/tasks/search-tasks/search-tasks.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchTasksComponent } from './search-tasks.component';
import { TasksService, Task } from '../tasks.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SearchTasksComponent', () => {
  let component: SearchTasksComponent;
  let fixture: ComponentFixture<SearchTasksComponent>;
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchTasksComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [TasksService]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTasksComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call TasksService.searchTasks with the entered query', () => {
    spyOn(service, 'searchTasks').and.returnValue(of([]));

    // Simulate user typing input
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'Update homepage color to Blue';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Click the search button
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(service.searchTasks).toHaveBeenCalledWith({ q: 'Update homepage color to Blue' });

  it('should display no list items when service returns an empty array', () => {
    spyOn(service, 'searchTasks').and.returnValue(of([]));

    component.query = 'anything';
    component.onSearch();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(0);
  });

  it('should render a <li> for each task returned by the service', () => {
    const fake: Task[] = [
      { _id: '1', title: 'Task A', description: '', status: '', priority: '', dateCreated: '', dateModified: '', projectId: 0 },
      { _id: '2', title: 'Task B', description: '', status: '', priority: '', dateCreated: '', dateModified: '', projectId: 0 }
    ];
    spyOn(service, 'searchTasks').and.returnValue(of(fake));

    component.query = 'test';
    component.onSearch();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(2);
    expect(items[0].nativeElement.textContent).toContain('Task A');
    expect(items[1].nativeElement.textContent).toContain('Task B');
  });
});
});
