import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFavoritePlacesComponent } from './user-profile-favorite-places.component';

describe('UserProfileFavoritePlacesComponent', () => {
    let component: UserProfileFavoritePlacesComponent;
    let fixture: ComponentFixture<UserProfileFavoritePlacesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserProfileFavoritePlacesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserProfileFavoritePlacesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
