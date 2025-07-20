import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProjectsComponent } from './list-projects.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Project } from '../projects.service';
import { environment } from '../../../environments/environment';
import { By } from '@angular/platform-browser';

describe('ListProjectsComponent', () => {
  let component: ListProjectsComponent;
  let fixture: ComponentFixture<ListProjectsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ListProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProjectsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
   
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should render the title "All Projects"', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('All Projects');
  });
it('should display "No projects found." when project list is empty', () => {
    component.projects = [];
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('p'));
    expect(msg.nativeElement.textContent).toContain('No projects found.');
  });


  it('should display table with project data when projects are present', () => {
    component.projects = [
      {_id:"473", projectId: 1, name: 'Test A', description: 'A', startDate: '', endDate: '' },
    ];
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();

    const row = fixture.debugElement.query(By.css('tbody tr'));
    expect(row.nativeElement.textContent).toContain('Test A');
  });

  
  
    it('should show "N/A" if description is missing', () => {
    component.projects = [
      { _id:"473",projectId: 1, name: 'Project X', description: '', startDate: '', endDate: '' },
    ];
    fixture.detectChanges();

    const cells = fixture.debugElement.queryAll(By.css('td'));
    expect(cells.some(cell => cell.nativeElement.textContent.includes('N/A'))).toBeTrue();
  });



});
