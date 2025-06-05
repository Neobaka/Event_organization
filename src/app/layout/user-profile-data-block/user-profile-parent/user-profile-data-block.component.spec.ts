import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDataBlockComponent } from './user-profile-data-block.component';

describe('UserProfileDataBlockComponent', () => {
    let component: UserProfileDataBlockComponent;
    let fixture: ComponentFixture<UserProfileDataBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserProfileDataBlockComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserProfileDataBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
