import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AccueilComponent } from './accueil/accueil.component';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: MainLayoutComponent, canActivate: [AuthGuard], children: [
      { path: '', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'goals', loadComponent: () => import('./components/goals/goals.component').then(m => m.GoalsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'recommendations', loadComponent: () => import('./components/recommendations/recommendations.component').then(m => m.RecommendationsComponent) }
    ]
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'accueil' }
];
