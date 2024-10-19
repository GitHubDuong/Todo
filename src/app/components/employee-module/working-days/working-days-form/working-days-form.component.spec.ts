import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDaysFormComponent } from './working-days-form.component';

describe('WorkingDaysFormComponent', () => {
  let component: WorkingDaysFormComponent;
  let fixture: ComponentFixture<WorkingDaysFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingDaysFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingDaysFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
