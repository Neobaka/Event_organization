import { Component, OnDestroy, ChangeDetectionStrategy, inject, Signal, signal, effect } from '@angular/core';
import { Auth2Service } from '../../../core/auth/services/auth2.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../../../core/auth/interfaces/user-details';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnDestroy {
    isLoading = signal(true);
    error = signal<string | null>(null);
    private userSubscription: Subscription | undefined;

    private authService = inject(Auth2Service);
    userData: Signal<UserDetails | null> = toSignal(this.authService.userData$, { initialValue: null });

    constructor() {
        effect(() => {
            const user = this.userData();
            const isAuth = this.authService.isAuth;

            if (!user && isAuth) {
                this.isLoading.set(true);
                this.error.set(null);
            } else if (!user && !isAuth) {
                this.error.set('Для просмотра профиля необходимо авторизоваться');
                this.isLoading.set(false);
            } else {
                this.isLoading.set(false);
                this.error.set(null);
            }
        });
    }

    public ngOnDestroy(): void {
    // Отписываемся, чтобы избежать утечек памяти
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }
}
