import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthDataService, HealthData } from '../../../services/health-data.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-health-data-form',
  templateUrl: './health-data-form.component.html',
  styleUrls: ['./health-data-form.component.scss']
})
export class HealthDataFormComponent implements OnInit {
  healthForm: FormGroup;
  exerciseTypes: string[] = ['Course', 'Natation', 'Vélo', 'Musculation', 'Yoga', 'Autre'];

  constructor(
    private fb: FormBuilder,
    private healthDataService: HealthDataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.healthForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      sleep_duration: [null, [Validators.min(0), Validators.max(24)]],
      sleep_quality: [null, [Validators.min(1), Validators.max(10)]],
      exercise_duration: [null, [Validators.min(0)]],
      exercise_type: [''],
      calories_burned: [null, [Validators.min(0)]],
      calories_consumed: [null, [Validators.min(0)]],
      protein: [null, [Validators.min(0)]],
      carbs: [null, [Validators.min(0)]],
      fat: [null, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Charger les données du jour si elles existent
    this.loadTodayData();
  }

  private loadTodayData(): void {
    const today = new Date().toISOString().split('T')[0];
    this.healthDataService.getHealthData(today, today).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.healthForm.patchValue(data[0]);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.healthForm.valid) {
      const formData = this.healthForm.value;
      const healthData: HealthData = {
        ...formData,
        user_id: this.authService.currentUser$.value?.id || 0
      };

      this.healthDataService.addHealthData(healthData).subscribe({
        next: () => {
          this.snackBar.open('Données enregistrées avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement:', error);
          this.snackBar.open('Erreur lors de l\'enregistrement des données', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
} 