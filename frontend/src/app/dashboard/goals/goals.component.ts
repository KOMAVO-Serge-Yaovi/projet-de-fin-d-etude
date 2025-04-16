import { Component } from '@angular/core';
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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent {
  showAddGoalForm = false;
  selectedCategory = '';
  categories: string[] = ['Health', 'Fitness', 'Wellness'];
  goals: Goal[] = [
    {
      id: 1,
      title: 'Run 5km',
      description: 'Complete a 5km run by the end of the month.',
      category: 'Fitness',
      targetValue: 5,
      currentValue: 2,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30')
    },
    {
      id: 2,
      title: 'Drink Water',
      description: 'Drink at least 2 liters of water daily.',
      category: 'Health',
      targetValue: 2,
      currentValue: 1.5,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30')
    }
  ];
  
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

  get filteredGoals(): Goal[] {
    if (!this.selectedCategory) {
      return this.goals;
    }
    return this.goals.filter(goal => goal.category === this.selectedCategory);
  }

  addGoal() {
    if (this.goalForm.valid) {
      const newGoal: Goal = {
        id: this.goals.length + 1,
        ...this.goalForm.value,
        currentValue: 0,
        status: 'en cours'
      };
      this.goals.push(newGoal);
      this.goalForm.reset();
      this.showAddGoalForm = false;
    }
  }

  cancelAddGoal() {
    this.goalForm.reset();
    this.showAddGoalForm = false;
  }

  updateGoalProgress(goal: Goal) {
    // Implémenter la logique de mise à jour de la progression
    console.log('Mise à jour de la progression pour:', goal);
  }

  deleteGoal(goal: Goal) {
    this.goals = this.goals.filter(g => g.id !== goal.id);
  }
}