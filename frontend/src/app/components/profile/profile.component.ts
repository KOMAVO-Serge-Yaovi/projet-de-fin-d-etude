import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize, catchError, retry } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  height: number;
  weight: number;
  avatar_url?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container">
      <header class="page-header">
        <h1>Mon Profil</h1>
        <p class="subtitle">Gérez vos informations personnelles et suivez vos statistiques de santé</p>
      </header>
      
      <div class="profile-content">
        <div class="loading-overlay" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-container">
              <img [src]="avatarUrl || 'assets/images/default-avatar.png'"
                   [alt]="profileForm.get('firstName')?.value || 'Avatar'"
                   class="avatar">
              <div class="avatar-overlay">
                <input type="file" (change)="changeAvatar($event)"
                       accept="image/*" style="display: none;"
                       id="avatarInput">
                <label for="avatarInput" class="change-avatar-btn">
                  <i class="fas fa-camera"></i>
                  Modifier
                </label>
              </div>
            </div>
            <h3 class="user-name">
              {{profileForm.get('firstName')?.value}} {{profileForm.get('lastName')?.value}}
            </h3>
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form" #form="ngForm">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <div class="input-container">
                <i class="fas fa-user input-icon"></i>
                <input type="text" id="firstName" formControlName="firstName" class="form-control"
                       [class.is-invalid]="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
              </div>
              <div class="error-message" *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
                Ce champ est requis
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Nom</label>
              <div class="input-container">
                <i class="fas fa-user input-icon"></i>
                <input type="text" id="lastName" formControlName="lastName" class="form-control"
                       [class.is-invalid]="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
              </div>
              <div class="error-message" *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                Ce champ est requis
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-container">
                <i class="fas fa-envelope input-icon"></i>
                <input type="email" id="email" formControlName="email" class="form-control"
                       [class.is-invalid]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
              </div>
              <div class="error-message" *ngIf="profileForm.get('email')?.errors?.['required'] && profileForm.get('email')?.touched">
                L'email est requis
              </div>
              <div class="error-message" *ngIf="profileForm.get('email')?.errors?.['email'] && profileForm.get('email')?.touched">
                Format d'email invalide
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <div class="input-container">
                <i class="fas fa-phone input-icon"></i>
                <input type="tel" id="phone" formControlName="phone" class="form-control">
              </div>
            </div>
            
            <div class="form-group">
              <label for="birthDate">Date de naissance</label>
              <div class="input-container">
                <i class="fas fa-calendar input-icon"></i>
                <input type="date" id="birthDate" formControlName="birthDate" class="form-control"
                       [class.is-invalid]="profileForm.get('birthDate')?.invalid && profileForm.get('birthDate')?.touched">
              </div>
              <div class="error-message" *ngIf="profileForm.get('birthDate')?.invalid && profileForm.get('birthDate')?.touched">
                Ce champ est requis
              </div>
            </div>
            
            <div class="form-group">
              <label for="gender">Genre</label>
              <div class="input-container">
                <i class="fas fa-venus-mars input-icon"></i>
                <select id="gender" formControlName="gender" class="form-control"
                        [class.is-invalid]="profileForm.get('gender')?.invalid && profileForm.get('gender')?.touched">
                  <option value="">Sélectionner</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="height">Taille (cm)</label>
              <div class="input-container">
                <i class="fas fa-ruler-vertical input-icon"></i>
                <input type="number" id="height" formControlName="height" class="form-control"
                       [class.is-invalid]="profileForm.get('height')?.invalid && profileForm.get('height')?.touched">
              </div>
              <div class="error-message" *ngIf="profileForm.get('height')?.invalid && profileForm.get('height')?.touched">
                Valeur invalide
              </div>
            </div>
            
            <div class="form-group">
              <label for="weight">Poids (kg)</label>
              <div class="input-container">
                <i class="fas fa-weight input-icon"></i>
                <input type="number" id="weight" formControlName="weight" class="form-control"
                       [class.is-invalid]="profileForm.get('weight')?.invalid && profileForm.get('weight')?.touched">
              </div>
              <div class="error-message" *ngIf="profileForm.get('weight')?.invalid && profileForm.get('weight')?.touched">
                Valeur invalide
              </div>
            </div>
            
            <div class="form-actions">
              <div class="action-buttons">
                <button type="button" class="cancel-btn" (click)="resetForm()"
                        [class.visible]="profileForm.dirty">
                  <i class="fas fa-times"></i> Annuler
                </button>
                <button type="submit" class="save-btn"
                        [disabled]="!profileForm.valid || !profileForm.dirty"
                        [class.pending]="isSubmitting">
                  <i class="fas fa-save"></i>
                  {{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}}
                </button>
              </div>
              <div class="form-status" *ngIf="profileForm.dirty">
                <span class="status-message">
                  <i class="fas fa-info-circle"></i>
                  Modifications non enregistrées
                </span>
              </div>
            </div>
          </form>
        </div>
        
        <div class="profile-stats">
          <h2>
            <i class="fas fa-chart-line"></i>
            Statistiques de santé
          </h2>
          <div class="stats-grid">
            <div class="stat-card" [class.highlight]="isBMIInRange()">
              <div class="stat-icon">
                <i class="fas fa-weight"></i>
              </div>
              <h3>IMC</h3>
              <div class="stat-value">{{ calculateBMI() }}</div>
              <div class="stat-label">kg/m²</div>
              <div class="stat-status" [class.warning]="!isBMIInRange()">
                {{ getBMIStatus() }}
              </div>
            </div>

            <div class="stat-card progress-card">
              <div class="stat-icon">
                <i class="fas fa-bullseye"></i>
              </div>
              <h3>Objectif de poids</h3>
              <div class="stat-value">
                {{ profileForm.get('weight')?.value || '--' }}
                <span class="target">→ {{ targetWeight }}</span>
              </div>
              <div class="stat-label">kg</div>
              <div class="progress-bar">
                <div class="progress" [style.width]="calculateWeightProgress() + '%'"></div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-running"></i>
              </div>
              <h3>Niveau d'activité</h3>
              <div class="stat-value">{{ activityLevel }}</div>
              <div class="stat-label">par semaine</div>
              <div class="activity-indicator">
                <span class="dot" *ngFor="let _ of [1,2,3,4,5]"
                      [class.active]="isActivityDotActive(_)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2.5rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
    }

    .page-header {
      margin-bottom: 3rem;
      text-align: center;
      position: relative;
    }

    .page-header::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background: var(--primary-color);
      margin: 1rem auto 0;
      border-radius: 2px;
    }

    .page-header h1 {
      font-size: 2.8rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .profile-content {
      position: relative;
      min-height: 200px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: 15px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .profile-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .avatar-section {
      text-align: center;
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .avatar-container {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .avatar-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      padding: 1.5rem 1rem 1rem;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .avatar-container:hover .avatar-overlay {
      opacity: 1;
    }

    .change-avatar-btn {
      background: white;
      color: var(--primary-color);
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .change-avatar-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .user-name {
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--primary-color);
      margin: 0;
    }

    .profile-form {
      background: white;
      padding: 2.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }

    .form-control:hover {
      border-color: #dee2e6;
      background: white;
    }

    .form-control:focus {
      border-color: var(--primary-color);
      background: white;
      box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
      outline: none;
    }

    .profile-stats {
      margin-top: 2rem;
      background: white;
      padding: 2.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card.pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
      100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
    }

    .loading {
      position: relative;
    }

    .loading::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(2px);
      border-radius: 15px;
      z-index: 1;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary-color);
      opacity: 0.1;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  profileForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  avatarUrl: string | null = null;
  targetWeight = 70;
  activityLevel = 'Modéré';
  private pendingAvatarFile: File | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.profileForm = this.initForm();
    this.loadUserProfile();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]]
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 400) {
      errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
    } else if (error.status === 404) {
      errorMessage = 'Profil non trouvé.';
    } else if (error.status === 422) {
      errorMessage = error.error?.error || 'Format de données invalide. Veuillez vérifier vos informations.';
    }
    this.showError(errorMessage);
    return throwError(() => error);
  }

  private loadUserProfile() {
    this.isLoading = true;
    this.http.get<UserProfile>(`${this.apiUrl}/profile`)
      .pipe(
        retry(environment.retryAttempts), // Ajout des retries
        catchError(error => this.handleError(error)),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (profile: any) => {
          // Conversion du snake_case vers camelCase
          const formattedProfile = {
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            birthDate: profile.birth_date,
            gender: profile.gender,
            height: profile.height,
            weight: profile.weight
          };
          this.profileForm.patchValue(formattedProfile);
          this.avatarUrl = profile.avatar_url || null;
        }
      });
  }

  onSubmit() {
    if (!this.profileForm.valid) {
      this.markFormGroupTouched(this.profileForm);
      this.showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareFormData();
    
    this.http.put(`${this.apiUrl}/profile`, formData)
      .pipe(
        retry(environment.retryAttempts), // Ajout des retries
        catchError(error => this.handleError(error)),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (response: any) => {
          this.showSuccess('Profil mis à jour avec succès');
          this.profileForm.markAsPristine();
          if (response?.avatarUrl) {
            this.avatarUrl = response.avatarUrl;
          }
          this.pendingAvatarFile = undefined;
        }
      });
  }

  private prepareFormData(): FormData | Record<string, any> {
    const formValue = { ...this.profileForm.value };
    
    // Conversion en snake_case pour le backend avec types appropriés
    const convertedData = {
      first_name: formValue.firstName || '',
      last_name: formValue.lastName || '',
      email: formValue.email || '',
      phone: formValue.phone || '',
      birth_date: formValue.birthDate || '',
      gender: formValue.gender || '',
      height: formValue.height ? Number(formValue.height) : '',
      weight: formValue.weight ? Number(formValue.weight) : ''
    };

    // Si nous avons un fichier avatar en attente
    if (this.pendingAvatarFile instanceof File) {
      const formData = new FormData();
      formData.append('avatar', this.pendingAvatarFile);
      
      // Ajouter les données converties au FormData
      Object.entries(convertedData).forEach(([key, value]) => {
        if (value !== '') {
          formData.append(key, String(value));
        }
      });
      
      return formData;
    }
    
    // Retourner uniquement les données non vides
    return Object.fromEntries(
      Object.entries(convertedData).filter(([_, value]) => value !== '')
    );
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  resetForm() {
    if (confirm('Voulez-vous vraiment annuler les modifications ?')) {
      this.loadUserProfile();
      this.pendingAvatarFile = undefined;
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  changeAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
        this.pendingAvatarFile = file;
        this.profileForm.markAsDirty();
      };
      
      reader.readAsDataURL(file);
    }
  }

  calculateBMI(): number {
    const weight = this.profileForm.get('weight')?.value;
    const height = this.profileForm.get('height')?.value / 100;
    if (weight && height) {
      return +(weight / (height * height)).toFixed(1);
    }
    return 0;
  }

  isBMIInRange(): boolean {
    const bmi = this.calculateBMI();
    return bmi >= 18.5 && bmi <= 24.9;
  }

  getBMIStatus(): string {
    const bmi = this.calculateBMI();
    if (bmi === 0) return 'Non calculé';
    if (bmi < 18.5) return 'Sous-poids';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Surpoids';
    return 'Obésité';
  }

  isActivityDotActive(index: number): boolean {
    const activityLevels = {
      'Sédentaire': 1,
      'Léger': 2,
      'Modéré': 3,
      'Actif': 4,
      'Très actif': 5
    };
    return index <= (activityLevels[this.activityLevel as keyof typeof activityLevels] || 0);
  }

  calculateWeightProgress(): number {
    const currentWeight = this.profileForm.get('weight')?.value;
    if (!currentWeight) return 0;
    const startWeight = 85; // Poids de départ
    const progress = ((startWeight - currentWeight) / (startWeight - this.targetWeight)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }
}