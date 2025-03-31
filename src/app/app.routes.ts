import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { AuthGuard } from './auth.guard';
import { ProfileViewComponent } from './profile-view/profile-view.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomePageComponent },
    { path: 'movies', component: MovieCardComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileViewComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
];
