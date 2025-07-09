import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with correct text', () => {
    const header = fixture.nativeElement.querySelector('header.header h1');
    expect(header.textContent).toContain('Task Management System');
  });

  it('should render footer with copyright text', () => {
    const footer = fixture.nativeElement.querySelector('footer.footer p');
    expect(footer.textContent).toContain('©2025 Web450-Task Management System');
  });

  

  it('should toggle projects submenu when toggleProjectsMenu is called', () => {
    expect(component.isProjectsMenuOpen).toBeFalse();

    component.toggleProjectsMenu();
    fixture.detectChanges();
    expect(component.isProjectsMenuOpen).toBeTrue();

    const subMenu = fixture.nativeElement.querySelector('.sidebar .sub-menu');
    expect(subMenu).toBeTruthy();
  });

  
});
