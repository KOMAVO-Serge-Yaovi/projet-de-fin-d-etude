import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container">
      <nav class="sidebar" style="text-align: center;">
        <div class="user-info">
          <img src="assets/images/avatar.png" alt="Avatar" class="avatar">
          <h3>Bienvenue {{ userName$ | async }}</h3>
        </div>
        <ul class="nav-menu">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <i class="icon">📊</i>
              Tableau de bord
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/profile" routerLinkActive="active">
              <i class="icon">👤</i>
              Profil
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/goals" routerLinkActive="active">
              <i class="icon">🎯</i>
              Objectifs
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/recommendations" routerLinkActive="active">
              <i class="icon">💡</i>
              Recommandations
            </a>
          </li>
        </ul>
      </nav>

      <main class="main-content">
      <header class="header">
          <h1></h1>
          <div class="header-actions">
            <button class="notification-btn">
              <i class="icon">🔔</i>
              <span class="notification-badge">{{ notifCount$ | async }}</span>
            </button>
            <button class="logout-btn" (click)="logout()">
              <i class="icon">🚪</i>
              Déconnexion
            </button>
          </div>
        </header>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      position: fixed;
      z-index: 10s;
      left: 0;
      top: 0;
      height: 100%;
      width: 250px;
      background-color: var(--primary-color);
      color: white;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .user-info {
      text-align: center;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 1rem;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
    }

    .nav-menu li {
      margin-bottom: 0.5rem;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    .nav-menu a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-menu a.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .icon {
      margin-right: 0.5rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .notification-btn, .logout-btn {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background-color: white;
      color: var(--text-color);
    }

    .notification-badge {
      background-color: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }

    .main-content {
      margin-left: 250px;
      padding: 2rem;
      background-color: #f5f5f5;
      flex: 1;
    }
  `]
})
export class MainLayoutComponent {
    userName$: Observable<string | null>;
    notifCount$: Observable<number | null>;

    constructor(private router: Router, private authService: AuthService) {
        this.userName$ = this.authService.currentUser$.pipe(
            map(user => user?.first_name || 'Utilisateur')
          );
          
        this.notifCount$ = this.authService.currentUser$.pipe(
              map(user => user?.unreadNotifCount || 0)
            );
    }
    navigate(path: string) {
        this.router.navigate([path]);
      }
    
      logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
}
