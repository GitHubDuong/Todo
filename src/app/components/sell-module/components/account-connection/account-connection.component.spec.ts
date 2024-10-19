import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConnectionComponent } from './account-connection.component';

describe('AccountConnectionComponent', () => {
  let component: AccountConnectionComponent;
  let fixture: ComponentFixture<AccountConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountConnectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
