import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <main class="main-content">
        <header class="header">
          <h1>Tableau de bord</h1>
          <div class="header-actions">
            <button class="notification-btn" (click)="handleNotificationClick()">
              <i class="icon">🔔</i>
              <span class="notification-badge">{{ notifCount }}</span>
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
              <canvas #weeklyActivityChart></canvas>
            </div>
          </div>
          <div class="chart-card">
            <h3>Progression des objectifs</h3>
            <div class="chart-placeholder">
              <canvas #goalsProgressChart></canvas>
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

    .logout-btn {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background-color: white;
      color: var(--text-color);
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
      height: 400px;
      background-color: #f8f9fa;
      border-radius: 5px;
      margin-top: 1rem;
    }

    .chart-placeholder canvas {
      width: 100% !important;
      height: 100% !important;
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
export class DashboardComponent implements AfterViewInit {
  @ViewChild('weeklyActivityChart') weeklyActivityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('goalsProgressChart') goalsProgressCanvas!: ElementRef<HTMLCanvasElement>;
  
  private weeklyActivityChart?: Chart;
  private goalsProgressChart?: Chart;
  notifCount = 3;

  ngAfterViewInit() {
    // Use requestAnimationFrame to ensure the DOM is ready
    requestAnimationFrame(() => {
      try {
        console.log('Initialisation des graphiques...');
        this.initializeCharts();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des graphiques:', error);
      }
    });
  }

  private initializeCharts() {
    this.renderWeeklyActivityChart();
    this.renderGoalsProgressChart();
  }

  private destroyCharts() {
    if (this.weeklyActivityChart) {
      this.weeklyActivityChart.destroy();
    }
    if (this.goalsProgressChart) {
      this.goalsProgressChart.destroy();
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  private renderWeeklyActivityChart() {
    if (!this.weeklyActivityCanvas) {
      console.error('Canvas element weeklyActivityChart not found');
      return;
    }
    const ctx = this.weeklyActivityCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for weeklyActivityChart');
      return;
    }

    this.weeklyActivityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        datasets: [{
          label: 'Pas',
          data: [7500, 8200, 9000, 7000, 8500, 10000, 9500],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private renderGoalsProgressChart() {
    if (!this.goalsProgressCanvas) {
      console.error('Canvas element goalsProgressChart not found');
      return;
    }
    const ctx = this.goalsProgressCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for goalsProgressChart');
      return;
    }

    this.goalsProgressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Complété', 'Restant'],
        datasets: [{
          label: 'Progression des objectifs',
          data: [70, 30],
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  handleNotificationClick() {
    alert('Vous avez ' + this.notifCount + ' nouvelles notifications !');
  }
}