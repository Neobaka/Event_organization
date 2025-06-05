import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileMyAfishaBlockComponent } from './user-profile-my-afisha-block.component';

describe('UserProfileMyAfishaBlockComponent', () => {
    let component: UserProfileMyAfishaBlockComponent;
    let fixture: ComponentFixture<UserProfileMyAfishaBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserProfileMyAfishaBlockComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserProfileMyAfishaBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
