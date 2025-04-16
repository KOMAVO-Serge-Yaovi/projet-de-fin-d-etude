import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <h1>Profil utilisateur</h1>
      
      <div class="profile-content">
        <div class="profile-header">
          <div class="avatar-section">
            <img src="assets/images/avatar.png" alt="Avatar" class="avatar">
            <button class="change-avatar-btn">Changer la photo</button>
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
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
              <label for="phone">Téléphone</label>
              <input type="tel" id="phone" formControlName="phone" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="birthDate">Date de naissance</label>
              <input type="date" id="birthDate" formControlName="birthDate" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="gender">Genre</label>
              <select id="gender" formControlName="gender" class="form-control">
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="height">Taille (cm)</label>
              <input type="number" id="height" formControlName="height" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="weight">Poids (kg)</label>
              <input type="number" id="weight" formControlName="weight" class="form-control">
            </div>
            
            <div class="form-actions">
              <button type="submit" class="save-btn" [disabled]="!profileForm.valid">Enregistrer les modifications</button>
              <button type="button" class="cancel-btn" (click)="resetForm()">Annuler</button>
            </div>
          </form>
        </div>
        
        <div class="profile-stats">
          <h2>Statistiques de santé</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>IMC</h3>
              <div class="stat-value">{{ calculateBMI() }}</div>
              <div class="stat-label">kg/m²</div>
            </div>
            <div class="stat-card">
              <h3>Objectif de poids</h3>
              <div class="stat-value">70</div>
              <div class="stat-label">kg</div>
            </div>
            <div class="stat-card">
              <h3>Niveau d'activité</h3>
              <div class="stat-value">Modéré</div>
              <div class="stat-label">par semaine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .profile-content {
      display: grid;
      gap: 2rem;
    }

    .profile-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
    }

    .avatar-section {
      text-align: center;
    }

    .avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      margin-bottom: 1rem;
    }

    .change-avatar-btn {
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .profile-form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
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
      border-radius: 5px;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .save-btn, .cancel-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .save-btn {
      background-color: var(--primary-color);
      color: white;
    }

    .save-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: #f8f9fa;
      color: var(--text-color);
    }

    .profile-stats {
      background-color: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .stat-card {
      text-align: center;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 5px;
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

    @media (max-width: 768px) {
      .profile-header {
        grid-template-columns: 1fr;
      }

      .profile-form {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthDate: [''],
      gender: [''],
      height: [''],
      weight: ['']
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Formulaire soumis:', this.profileForm.value);
      // Implémenter la logique de sauvegarde
    }
  }

  resetForm() {
    this.profileForm.reset();
  }

  calculateBMI(): number {
    const weight = this.profileForm.get('weight')?.value;
    const height = this.profileForm.get('height')?.value;
    
    if (weight && height) {
      return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
    }
    return 0;
  }
} 