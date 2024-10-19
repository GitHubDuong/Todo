import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPricesNewComponent } from './room-prices-new.component';

describe('RoomPricesNewComponent', () => {
  let component: RoomPricesNewComponent;
  let fixture: ComponentFixture<RoomPricesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomPricesNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPricesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
