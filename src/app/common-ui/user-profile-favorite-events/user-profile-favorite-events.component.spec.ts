import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFavoriteEventsComponent } from './user-profile-favorite-events.component';

describe('UserProfilePlannedEventsComponent', () => {
  let component: UserProfileFavoriteEventsComponent;
  let fixture: ComponentFixture<UserProfileFavoriteEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileFavoriteEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileFavoriteEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
