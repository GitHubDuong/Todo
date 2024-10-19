import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomConfigTypeFormComponent } from './room-config-type-form.component';

describe('RoomConfigTypeFormComponent', () => {
  let component: RoomConfigTypeFormComponent;
  let fixture: ComponentFixture<RoomConfigTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomConfigTypeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomConfigTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
