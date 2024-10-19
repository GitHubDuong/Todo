import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardFormApplicationComponent } from './standard-form-application.component';

describe('StandardFormApplicationComponent', () => {
  let component: StandardFormApplicationComponent;
  let fixture: ComponentFixture<StandardFormApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardFormApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardFormApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
