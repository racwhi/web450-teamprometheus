// tms-client/src/app/projects/create-project.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProjectComponent } from './create-project.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { By } from '@angular/platform-browser';

describe('CreateProjectComponent', () => {
  let component: CreateProjectComponent;
  let fixture: ComponentFixture<CreateProjectComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateProjectComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding HTTP calls
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.projectForm.invalid).toBeTrue();
  });

  it('form should be valid when required fields are set', () => {
    component.projectForm.controls['projectId'].setValue(3001);
    component.projectForm.controls['name'].setValue('Test Project');
    expect(component.projectForm.valid).toBeTrue();
  });

  it('should disable submit button if form is invalid', () => {
    // leave form empty (invalid)
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(btn.disabled).toBeTrue();
  });

  it('should call POST /api/projects when form is valid', () => {
    // set up valid form
    component.projectForm.controls['projectId'].setValue(3002);
    component.projectForm.controls['name'].setValue('Demo Project');
    fixture.detectChanges();

    // submit
    component.onSubmit();

    // expect a POST to the correct URL
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      projectId: 3002,
      name: 'Demo Project',
      description: '',
      startDate: '',
      endDate: ''
    });

    // flush a mock response
    req.flush({ _id: 'abc123', projectId: 3002, name: 'Demo Project' });

    // verify successMessage is set
    expect(component.successMessage).toBe('Project created');
  });
});
