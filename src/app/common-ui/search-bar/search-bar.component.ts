import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NgForOf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-search-bar',
    imports: [
        MatIcon,
        MatMenu,
        MatSelectModule,
        MatOptionModule,
        NgForOf,
        MatMenuTrigger,
        MatRadioGroup,
        MatRadioButton,
        MatTooltip
    ],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
    sortOptions = [
        { value: 'name', label: 'По имени' },
        { value: 'date', label: 'По дате' },
        { value: 'rating', label: 'По рейтингу' },
        { value: 'expensive', label: 'Сначала подороже' },
        { value: 'cheap', label: 'Сначала подешевле' }
    ];
    selectedSort = this.sortOptions[0].value;

    /**
     *
     */
    selectSort(val: string) {
        this.selectedSort = val;
    }
}
