import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { routes } from './app.routes';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/auth/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/auth/interceptors/error.interceptor';
import { provideNgxSkeletonLoader } from 'ngx-skeleton-loader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        importProvidersFrom(
            BrowserModule,
            AngularFireModule.initializeApp(environment.firebase),
            AngularFireAuthModule
        ),
        provideHttpClient(
            withInterceptors([
                jwtInterceptor,
                errorInterceptor,
            ])
        ),
        provideNgxSkeletonLoader()
    ]
};
