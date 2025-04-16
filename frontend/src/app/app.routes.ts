import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AccueilComponent } from './accueil/accueil.component';

export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'goals', loadComponent: () => import('./dashboard/goals/goals.component').then(m => m.GoalsComponent) },
      { path: 'profile', loadComponent: () => import('./dashboard/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'recommendations', loadComponent: () => import('./dashboard/recommendations/recommendations.component').then(m => m.RecommendationsComponent) }
    ]
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'accueil' }
];
