import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePlannedEventsComponent } from './user-profile-planned-events.component';

describe('UserProfilePlannedEventsComponent', () => {
  let component: UserProfilePlannedEventsComponent;
  let fixture: ComponentFixture<UserProfilePlannedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfilePlannedEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfilePlannedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
