import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureChangeShiftFormComponent } from './procedure-change-shift-form.component';

describe('ProcedureChangeShiftFormComponent', () => {
  let component: ProcedureChangeShiftFormComponent;
  let fixture: ComponentFixture<ProcedureChangeShiftFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedureChangeShiftFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureChangeShiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
