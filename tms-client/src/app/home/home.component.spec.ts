import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        RouterTestingModule  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render welcome message in h3 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h3 = compiled.querySelector('h3');
    expect(h3?.textContent).toContain('Welcome to the Task Management System');
  });

  it('should render two card-link elements', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cardLinks = compiled.querySelectorAll('.card-link');
    expect(cardLinks.length).toBe(2);
  });
});
