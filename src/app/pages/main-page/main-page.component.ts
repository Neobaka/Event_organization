import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { EventCardBlockComponent } from '../../layout/event-card-block/event-card-block.component';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { SearchBarComponent } from '../../common-ui/search-bar/search-bar.component';
import { EventService } from '../../events_data/event.service';
import { FliterByCategoryPipe } from '../../events_data/fliter-by-category.pipe';
import { AsyncPipe, NgIf } from '@angular/common';
import { EventModel } from '../../events_data/event-model';
import { filter, Observable, startWith, switchMap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-main-page',
    imports: [
        EventCardBlockComponent,
        HeaderComponent,
        SearchBarComponent,
        FliterByCategoryPipe,
        AsyncPipe,
        NgIf,
    ],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
    private eventService = inject(EventService);
    private router = inject(Router);

    public allEvents$!: Observable<EventModel[]>;
    ngOnInit(): void {
        this.allEvents$ = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            startWith(null), // чтобы сразу был первый запрос
            switchMap(() => this.eventService.getEvents(0, 100))
        );
    }
}
