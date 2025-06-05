import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventCardBlockComponent } from '../../layout/event-card-block/event-card-block.component';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { SearchBarComponent } from '../../common-ui/search-bar/search-bar.component';
import { EventService } from '../../events_data/event.service';
import { FliterByCategoryPipe } from '../../events_data/fliter-by-category.pipe';
import { EventModel } from '../../events_data/event-model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-main-page',
    imports: [
        EventCardBlockComponent,
        HeaderComponent,
        SearchBarComponent,
        FliterByCategoryPipe,
    ],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
    public allEvents: EventModel[] = [];

    private eventService = inject(EventService);

    public ngOnInit(): void {
        this.eventService.getEvents(0, 100).subscribe((events): void => {
            this.allEvents = events;
        });
    }
}
