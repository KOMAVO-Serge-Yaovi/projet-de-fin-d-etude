import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});
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
  private apiUrl = `${environment.apiUrl}/api/goals`;

  constructor(private http: HttpClient) { }

  fetchGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl,{headers}).pipe(
      catchError(this.handleError)
    );
  }

  fetchGoalsByDateRange(startDate: string, endDate: string): Observable<Goal[]> {
    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get<Goal[]>(this.apiUrl, { params,headers },).pipe(
      catchError(this.handleError)
    );
  }

  addGoal(goal: Omit<Goal, 'id'>): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal,{headers}).pipe(
      catchError(this.handleError)
    );
  }

  updateGoal(id: number, goal: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, goal,{headers}).pipe(
      catchError(this.handleError)
    );
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'Something went wrong; please try again later.';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.error && error.error.error) {
      errorMessage = error.error.error;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
