import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardBlockComponent } from './event-card-block.component';

describe('EventCardBlockComponent', () => {
    let component: EventCardBlockComponent;
    let fixture: ComponentFixture<EventCardBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventCardBlockComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventCardBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
