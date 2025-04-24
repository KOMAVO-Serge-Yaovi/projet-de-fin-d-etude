import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  categories: string[] = ['Poids', 'Exercice', 'Nutrition', 'Sommeil', 'Hydratation'];
  selectedCategory: string = '';
  searchTerm: string = '';
  showAddGoalForm: boolean = false;
  goalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      targetValue: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Charger les objectifs depuis le stockage local
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      this.goals = JSON.parse(savedGoals);
    }
  }

  get filteredGoals(): Goal[] {
    return this.goals
      .filter(goal => !this.selectedCategory || goal.category === this.selectedCategory)
      .filter(goal => 
        !this.searchTerm || 
        goal.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  addGoal() {
    if (this.goalForm.valid) {
      const newGoal: Goal = {
        id: Date.now(),
        ...this.goalForm.value,
        currentValue: 0
      };
      this.goals.push(newGoal);
      this.saveGoals();
      this.goalForm.reset();
      this.showAddGoalForm = false;
    }
  }

  cancelAddGoal() {
    this.goalForm.reset();
    this.showAddGoalForm = false;
  }

  deleteGoal(goal: Goal) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      this.goals = this.goals.filter(g => g.id !== goal.id);
      this.saveGoals();
    }
  }

  updateGoalProgress(goal: Goal) {
    const index = this.goals.findIndex(g => g.id === goal.id);
    if (index !== -1) {
      this.goals[index] = { ...goal };
      this.saveGoals();
    }
  }

  private saveGoals() {
    localStorage.setItem('goals', JSON.stringify(this.goals));
  }
}