import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileMyTicketsComponent } from './user-profile-my-tickets.component';

describe('UserProfileMyTicketsComponent', () => {
  let component: UserProfileMyTicketsComponent;
  let fixture: ComponentFixture<UserProfileMyTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileMyTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileMyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
