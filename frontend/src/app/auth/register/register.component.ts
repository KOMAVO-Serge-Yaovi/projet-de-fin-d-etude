import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <h2>Inscription</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input type="text" id="firstName" formControlName="firstName" class="form-control">
        </div>
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" formControlName="lastName" class="form-control">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" formControlName="password" class="form-control">
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" formControlName="confirmPassword" class="form-control">
        </div>
        <button type="submit" [disabled]="!registerForm.valid" class="auth-button">S'inscrire</button>
      </form>
      <p>
        Déjà inscrit ? 
        <a (click)="navigate('/login')" class="auth-link">Se connecter</a>
      </p>
      <div class="return-home">
        <a (click)="navigate('/accueil')" class="btn btn-secondary">Retourner à l'accueil</a>
      </div>
      <div *ngIf="registerForm.invalid && registerForm.touched" class="form-validation">
        <p *ngIf="registerForm.get('firstName')?.invalid">Le prénom est requis.</p>
        <p *ngIf="registerForm.get('lastName')?.invalid">Le nom est requis.</p>
        <p *ngIf="registerForm.get('email')?.invalid">L'email est invalide.</p>
        <p *ngIf="registerForm.get('password')?.invalid">Le mot de passe est requis et doit contenir au moins 6 caractères.</p>
        <p *ngIf="registerForm.get('confirmPassword')?.invalid">Les mots de passe ne correspondent pas.</p>
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

    .auth-link {
      color: var(--primary-color);
      text-decoration: none;
      cursor: pointer;
    }

    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;
      this.authService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password
      }).subscribe({
        next: () => {
          alert('Inscription réussie !');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(`Erreur lors de l'inscription : ${err.error?.message || 'Veuillez réessayer.'}`);
        }
      });
    }
  }
}