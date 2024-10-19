import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypesAddFormComponent } from './room-types-add-form.component';

describe('RoomTypesAddFormComponent', () => {
  let component: RoomTypesAddFormComponent;
  let fixture: ComponentFixture<RoomTypesAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomTypesAddFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomTypesAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
