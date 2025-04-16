import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="sidebar">
        <div class="user-info">
          <img src="assets/images/avatar.png" alt="Avatar" class="avatar">
          <h3>Bienvenue, {{ userName$ | async }}</h3>
        </div>
        <ul class="nav-menu">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
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
          <h1>Tableau de bord</h1>
          <div class="header-actions">
            <button class="notification-btn">
              <i class="icon">🔔</i>
              <span class="notification-badge">3</span>
            </button>
            <button class="logout-btn" (click)="logout()">
              <i class="icon">🚪</i>
              Déconnexion
            </button>
          </div>
        </header>

        <div class="stats-container">
          <div class="stat-card">
            <h3>Activité physique</h3>
            <div class="stat-value">7,500</div>
            <div class="stat-label">pas aujourd'hui</div>
          </div>
          <div class="stat-card">
            <h3>Sommeil</h3>
            <div class="stat-value">7.5</div>
            <div class="stat-label">heures</div>
          </div>
          <div class="stat-card">
            <h3>Hydratation</h3>
            <div class="stat-value">1.8</div>
            <div class="stat-label">litres</div>
          </div>
        </div>

        <div class="charts-container">
          <div class="chart-card">
            <h3>Activité hebdomadaire</h3>
            <div class="chart-placeholder">
              <!-- Graphique d'activité -->
            </div>
          </div>
          <div class="chart-card">
            <h3>Progression des objectifs</h3>
            <div class="chart-placeholder">
              <!-- Graphique de progression -->
            </div>
          </div>
        </div>
      </main>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background-color: var(--primary-color);
      color: white;
      padding: 1.5rem;
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

    .main-content {
      flex: 1;
      padding: 2rem;
      background-color: #f5f5f5;
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

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary-color);
      margin: 0.5rem 0;
    }

    .stat-label {
      color: var(--text-color);
    }

    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .chart-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .chart-placeholder {
      height: 200px;
      background-color: #f8f9fa;
      border-radius: 5px;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }

      .charts-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  userName$: Observable<string | null>;

  constructor(private router: Router, private authService: AuthService) {
    this.userName$ = this.authService.currentUser$.pipe(
      map(user => user?.first_name || 'Utilisateur')
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