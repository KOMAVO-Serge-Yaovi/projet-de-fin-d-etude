import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <h2>Connexion</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" formControlName="password" class="form-control">
        </div>
        <div *ngIf="loginForm.invalid && loginForm.touched" class="form-validation">
          <p *ngIf="loginForm.get('email')?.invalid">L'email est invalide.</p>
          <p *ngIf="loginForm.get('password')?.invalid">Le mot de passe est requis et doit contenir au moins 6 caractères.</p>
        </div>
        <button type="submit" [disabled]="!loginForm.valid" class="auth-button">Se connecter</button>
      </form>
      <p>
        Pas encore de compte ? 
        <a (click)="navigate('/register')" style="cursor: pointer;">S'inscrire</a>
      </p>
      <div class="return-home">
        <a (click)="navigate('/accueil')" class="btn btn-secondary">Retourner à l'accueil</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      color: var(--primary-color);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .auth-button {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .auth-button:hover {
      background-color: #388E3C;
    }

    .auth-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    p {
      text-align: center;
      margin-top: 1rem;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: () => {
          alert('Connexion réussie !');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert(`Erreur lors de la connexion : ${err.error?.message || 'Veuillez réessayer.'}`);
        }
      });
    }
  }
}