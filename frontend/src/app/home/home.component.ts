import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="main-container">
      <header class="header">
        <div class="auth-buttons">
          <button (click)="navigate('/auth/login')" class="auth-button login-button">Connexion</button>
          <button (click)="navigate('/auth/register')" class="auth-button register-button">Inscription</button>
        </div>
        <h1 class="welcome-title">Bienvenue sur Health Tracker</h1>
        <p class="welcome-subtitle">Votre compagnon personnel pour un suivi de santé intelligent et efficace</p>
      </header>

      <div class="features-container">
        <div class="feature-card">
          <div class="feature-icon">
            <img src="assets/icons/chart.png" alt="Suivi" class="icon">
          </div>
          <h2 class="feature-title">Suivi Personnalisé</h2>
          <p class="feature-description">
            Suivez vos données de santé en temps réel et obtenez des analyses personnalisées pour améliorer votre bien-être.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <img src="assets/icons/target.png" alt="Objectifs" class="icon">
          </div>
          <h2 class="feature-title">Objectifs Santé</h2>
          <p class="feature-description">
            Définissez vos objectifs de santé et suivez votre progression avec des tableaux de bord intuitifs.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <img src="assets/icons/bulb.png" alt="Recommandations" class="icon">
          </div>
          <h2 class="feature-title">Recommandations Intelligentes</h2>
          <p class="feature-description">
            Recevez des recommandations personnalisées basées sur vos données et votre progression.
          </p>
        </div>
      </div>

      <div class="cta-container">
        <button (click)="navigate('/auth/register')" class="cta-button primary">Commencer gratuitement</button>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .auth-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .welcome-subtitle {
      font-size: 1.2rem;
      color: var(--text-color);
      max-width: 600px;
      margin: 0 auto;
    }

    .features-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .feature-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
    }

    .icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .feature-title {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }

    .feature-description {
      color: var(--text-color);
      line-height: 1.6;
    }

    .auth-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .login-button {
      background-color: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
    }

    .login-button:hover {
      background-color: var(--primary-color);
      color: white;
    }

    .register-button {
      background-color: var(--primary-color);
      color: white;
    }

    .register-button:hover {
      background-color: #388E3C;
    }

    .cta-container {
      text-align: center;
      margin-top: 4rem;
    }

    .cta-button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cta-button.primary {
      background-color: var(--primary-color);
      color: white;
    }

    .cta-button.primary:hover {
      background-color: #388E3C;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .features-container {
        grid-template-columns: 1fr;
      }

      .welcome-title {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
} 