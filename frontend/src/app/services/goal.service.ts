import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Goal {
  id?: number;
  user_id: number;
  date: string;
  category: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  sleep_duration?: number;
  sleep_quality?: number;
  exercise_duration?: number;
  exercise_type?: string;
  calories_burned?: number;
  calories_consumed?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = `${environment.apiUrl}/api/health`;

  constructor(private http: HttpClient) { }

  fetchGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  fetchGoalsByDateRange(startDate: string, endDate: string): Observable<Goal[]> {
    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get<Goal[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  addGoal(goal: Omit<Goal, 'id'>): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal).pipe(
      catchError(this.handleError)
    );
  }

  updateGoal(id: number, goal: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, goal).pipe(
      catchError(this.handleError)
    );
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}