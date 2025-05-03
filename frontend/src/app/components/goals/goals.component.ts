import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../shared/modal/modal.component';
import { HealthDataService, HealthData } from '../../services/health-data.service';
import { CategoryType, CATEGORIES, CATEGORY_MAPPINGS } from '../../models/category.types';
import { finalize } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent
  ],
  styles: [`
    .goals-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }

    .error-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      margin: 1rem 0;
      background-color: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      font-size: 1rem;
    }

    .goals-categories.loading {
      opacity: 0.6;
      pointer-events: none;
    }

    .goal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .goal-actions h2 {
      font-size: 2rem;
      color: #333;
      margin: 0;
    }

    .goal-actions button:not(.delete-btn)  {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .goal-actions button:hover:not(.delete-btn) {
      background: #45a049;
      transform: translateY(-1px);
    }

    .goals-categories {
      margin-top: 2rem;
    }

    .category-section {
      margin-bottom: 2.5rem;
    }

    .category-title {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #4CAF50;
    }    .goals-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .goal-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .goal-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .goal-item h4 {
      font-size: 1.25rem;
      color: #2c3e50;
      margin: 0 0 1rem 0;
    }

    .description {
      color: #666;
      margin: 1rem 0;
    }

    .goal-details {
      margin: 1rem 0;
    }

    .category {
      color: #666;
      font-size: 0.9rem;
    }

    .progress-container {
      margin-top: 1rem;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .progress-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s ease;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .dates, .nutrition-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .date-input, .nutrition-field {
      width: 100%;
    }

    .nutrition-fields {
      grid-template-columns: repeat(3, 1fr);
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .nutrition-field {
      display: flex;
      flex-direction: column;
    }

    .nutrition-field label {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .nutrition-field input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .required-fields {
      font-size: 0.875rem;
      color: #666;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }

    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
      border-color: #dc3545;
      background-color: #fff8f8;
    }

    .form-group input.error:focus,
    .form-group textarea.error:focus,
    .form-group select.error:focus {
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
    }

    .error-message {
      display: block;
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .form-actions button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .form-actions button[type="submit"] {
      background: #4CAF50;
      color: white;
    }

    .form-actions button[type="submit"]:hover {
      background: #45a049;
    }

    .form-actions button[type="button"] {
      background: #f44336;
      color: white;
    }

    .form-actions button[type="button"]:hover {
      background: #d32f2f;
    }

    .form-actions button[disabled] {
      background: #cccccc;
      cursor: not-allowed;
      opacity: 0.7;
    }

    .form-actions button i {
      margin-right: 0.5rem;
    }

    button[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .update-btn,
    .delete-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .update-btn {
      background: #2196F3;
      color: white;
    }

    .update-btn:hover {
      background: #1976D2;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .delete-btn:hover {
      background: #c82333;
      transform: translateY(-2px);
    }

    .delete-btn:active {
      transform: translateY(0);
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin: 1rem 0;
      align-items: center;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      border: none;
      background: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .pagination button:hover {
      background: #e0e0e0;
    }

    .pagination button:disabled {
      background: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }

    .pagination button.active {
      background: #4CAF50;
      color: white;
    }

    .pagination-info {
      margin: 0 1rem;
      color: #666;
    }
  `]
})
export class GoalsComponent implements OnInit {
  readonly availableCategories: CategoryType[] = CATEGORIES;

  getCategoryLabel(category: CategoryType): string {
    return CATEGORY_MAPPINGS[category].label;
  }

  getTargetValuePlaceholder(category?: string): string {
    if (!category) return '10000';
    
    switch (category) {
      case 'Santé':
        return '8 (qualité de sommeil sur 10)';
      case 'Fitness':
        return '30 (minutes d\'exercice)';
      case 'Nutrition':
        return '2000 (calories par jour)';
      case 'Sommeil':
        return '8 (heures de sommeil)';
      default:
        return '10000';
    }
  }

  getCategoryValue(goal: HealthData, category: CategoryType): string {
    let value: number | undefined;
    switch (category) {
      case 'Santé':
        value = goal.sleep_quality;
        break;
      case 'Fitness':
        value = goal.exercise_duration;
        break;
      case 'Nutrition':
        value = goal.calories_consumed;
        break;
      case 'Sommeil':
        value = goal.sleep_duration;
        break;
    }
    const { label, unit } = CATEGORY_MAPPINGS[category];
    return `${label}: ${value || 0}${unit ? ' ' + unit : ''}`;
  }
  searchTerm = '';
  groupedGoals: { [K in CategoryType]: HealthData[] } = {
    'Santé': [],
    'Fitness': [],
    'Nutrition': [],
    'Sommeil': []
  };

  paginatedGoals: { [K in CategoryType]: { goals: HealthData[]; currentPage: number; totalPages: number } } = {
    'Santé': { goals: [], currentPage: 1, totalPages: 1 },
    'Fitness': { goals: [], currentPage: 1, totalPages: 1 },
    'Nutrition': { goals: [], currentPage: 1, totalPages: 1 },
    'Sommeil': { goals: [], currentPage: 1, totalPages: 1 }
  };

  private validateAndGetCategory(category: string | CategoryType): CategoryType {
    const validCategory = CATEGORIES.find(c => c === category);
    if (!validCategory) {
      throw new Error(`Invalid category: ${category}`);
    }
    return validCategory;
  }
  showAddGoalForm = false;
  categories: CategoryType[] = CATEGORIES;
  goalForm!: FormGroup;
  formErrors: { [key: string]: string } = {};
  isLoading = false;
  errorMessage = '';
  
  // Validation messages
  validationMessages: { [key: string]: { [key: string]: string } } = {
    'title': {
      'required': 'Le titre est obligatoire',
      'minlength': 'Le titre doit contenir au moins 3 caractères'
    },
    'description': {
      'required': 'La description est obligatoire',
      'minlength': 'La description doit contenir au moins 10 caractères'
    },
    'category': {
      'required': 'La catégorie est obligatoire'
    },
    'targetValue': {
      'required': 'La valeur cible est obligatoire',
      'min': 'La valeur cible doit être supérieure à 0'
    },
    'startDate': {
      'required': 'La date de début est obligatoire'
    },
    'endDate': {
      'required': 'La date de fin est obligatoire'
    }
  };

  ngOnInit() {
    this.loadGoals();
  }

  private loadGoals() {
    this.isLoading = true;
    this.errorMessage = '';

    this.healthDataService.getHealthData()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (healthData: HealthData[]) => {
          this.availableCategories.forEach(category => {
            this.groupedGoals[category] = healthData.filter((data: HealthData) => {
              switch(category) {
                case 'Santé':
                  return data.sleep_quality !== undefined;
                case 'Fitness':
                  return data.exercise_duration !== undefined;
                case 'Nutrition':
                  return data.calories_consumed !== undefined;
                case 'Sommeil':
                  return data.sleep_duration !== undefined;
                default:
                  return false;
              }
            });
            this.updatePaginatedGoals(category);
          });
        },
        error: (error) => {
          console.error('Error loading health data:', error);
          this.errorMessage = error.message || 'Erreur lors du chargement des données. Veuillez réessayer.';
        }
      });
  }

  constructor(
    private fb: FormBuilder,
    private healthDataService: HealthDataService
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      targetValue: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      exercise_type: [''],
      protein: [''],
      carbs: [''],
      fat: ['']
    });

    // Subscribe to form value changes to update validation messages
    this.goalForm.valueChanges.subscribe(() => {
      this.onFormValueChanged();
    });
  }

  private onFormValueChanged() {
    if (!this.goalForm) { return; }

    // Clear previous validation messages
    this.formErrors = {};

    // Check validation for each field
    Object.keys(this.goalForm.controls).forEach(field => {
      const control = this.goalForm.get(field);
      if (control && !control.valid && (control.dirty || control.touched)) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors || {}).forEach(key => {
          this.formErrors[field] = messages[key];
        });
      }
    });
  }

  filterGoals() {
    // Implémentation de la fonction de filtrage
    console.log('Filtrage avec le terme:', this.searchTerm);
  }

  openAddGoalModal() {
    this.showAddGoalForm = true;
    this.initializeForm(); // Reset form when opening modal
  }

  cancelAddGoal() {
    this.showAddGoalForm = false;
    this.goalForm.reset();
    this.formErrors = {}; // Clear validation errors
  }

  addGoal() {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      
      if (new Date(formValue.endDate) <= new Date(formValue.startDate)) {
        this.formErrors['endDate'] = 'La date de fin doit être postérieure à la date de début';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      // Ensure title and description are strings
      const title = String(formValue.title || '').trim();
      const description = String(formValue.description || '').trim();

      if (!title) {
        this.formErrors['title'] = 'Le titre est obligatoire';
        return;
      }

      if (!description) {
        this.formErrors['description'] = 'La description est obligatoire';
        return;
      }

      const newHealthData: HealthData = {
        user_id: 0, // Will be set by backend
        date: formValue.startDate,
        title: title,
        description: description,
        category: formValue.category,
        sleep_duration: formValue.category === 'Sommeil' ? Number(formValue.targetValue) : undefined,
        sleep_quality: formValue.category === 'Santé' ? Number(formValue.targetValue) : undefined,
        exercise_duration: formValue.category === 'Fitness' ? Number(formValue.targetValue) : undefined,
        calories_consumed: formValue.category === 'Nutrition' ? Number(formValue.targetValue) : undefined,
        exercise_type: formValue.exercise_type || undefined,
        protein: formValue.category === 'Nutrition' ? Number(formValue.protein) : undefined,
        carbs: formValue.category === 'Nutrition' ? Number(formValue.carbs) : undefined,
        fat: formValue.category === 'Nutrition' ? Number(formValue.fat) : undefined
      };

      // Add additional fields based on category
      switch (formValue.category) {
        case 'Nutrition':
          if (!formValue.protein || !formValue.carbs || !formValue.fat) {
            this.formErrors['protein'] = 'Veuillez remplir les informations nutritionnelles';
            return;
          }
          break;
        case 'Fitness':
          if (!formValue.exercise_type) {
            this.formErrors['exercise_type'] = 'Veuillez spécifier le type d\'exercice';
            return;
          }
          break;
      }

      this.healthDataService.addHealthData(newHealthData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data: HealthData) => {
            const category = this.validateAndGetCategory(this.getCategoryForHealthData(data));
            this.groupedGoals[category].push(data);
            this.updatePaginatedGoals(category);
            this.cancelAddGoal();
          },
          error: (error) => {
            console.error('Error adding health data:', error);
            if (error.status === 422) {
              this.errorMessage = 'Validation échouée. Veuillez vérifier vos données.';
              if (error.error && error.error.msg) {
                this.formErrors['title'] = error.error.msg;
              }
            } else {
              this.errorMessage = 'Erreur lors de l\'ajout des données. Veuillez réessayer.';
            }
          }
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.goalForm.controls).forEach(key => {
        const control = this.goalForm.get(key);
        control?.markAsTouched();
      });
      this.onFormValueChanged();
    }
  }

  private updatePaginatedGoals(category: CategoryType, pageNumber?: number) {
    const itemsPerPage = 6;
    const goals = this.groupedGoals[category];
    const totalPages = Math.ceil(goals.length / itemsPerPage);
    const currentPage = pageNumber || 1;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    this.paginatedGoals[category] = {
      goals: goals.slice(startIndex, endIndex),
      currentPage: currentPage,
      totalPages
    };
  }

  updateGoalProgress(data: HealthData) {
    if (!data.id) {
      this.errorMessage = 'ID des données manquant';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.healthDataService.updateHealthData(data.id, data)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updatedData: HealthData) => {
          const validCategory = this.validateAndGetCategory(this.getCategoryForHealthData(updatedData));
          const goals = this.groupedGoals[validCategory];
          const index = goals.findIndex((g: HealthData) => g.id === updatedData.id);
          if (index !== -1) {
            goals[index] = updatedData;
            this.updatePaginatedGoals(validCategory);
          }
        },
        error: (error) => {
          console.error('Error updating health data:', error);
          this.errorMessage = error.message || 'Erreur lors de la mise à jour des données. Veuillez réessayer.';
        }
      });
  }

  deleteGoal(data: HealthData) {
    if (!data.id) {
      this.errorMessage = 'ID des données manquant';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.healthDataService.deleteHealthData(data.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          const category = this.validateAndGetCategory(this.getCategoryForHealthData(data));
          const goals = this.groupedGoals[category];
          this.groupedGoals[category] = goals.filter((g: HealthData) => g.id !== data.id);
          this.updatePaginatedGoals(category);
        },
        error: (error) => {
          console.error('Error deleting health data:', error);
          this.errorMessage = error.message || 'Erreur lors de la suppression des données. Veuillez réessayer.';
        }
      });
  }

  private getCategoryForHealthData(data: HealthData): CategoryType {
    if (data.sleep_quality !== undefined) return 'Santé' as CategoryType;
    if (data.exercise_duration !== undefined) return 'Fitness' as CategoryType;
    if (data.calories_consumed !== undefined) return 'Nutrition' as CategoryType;
    return 'Sommeil' as CategoryType;
  }

  changePage(category: CategoryType, page: number) {
    const paginated = this.paginatedGoals[category];
    if (page > 0 && page <= paginated.totalPages) {
      this.updatePaginatedGoals(category, page);
    }
  }

  getPageNumbers(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}