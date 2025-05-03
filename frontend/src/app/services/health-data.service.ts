import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:4200',
  'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization'
});
export interface HealthData {
  id?: number;
  user_id: number;
  date: string;
  title?: string;
  description?: string;
  sleep_duration?: number;
  sleep_quality?: number;
  exercise_duration?: number;
  exercise_type?: string;
  calories_burned?: number;
  calories_consumed?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthDataService {
  private readonly API_URL = environment.apiUrl + '/api/health_data';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Une erreur s\'est produite:', error.error);
      return throwError(() => new Error('Le serveur est inaccessible. Veuillez vérifier votre connexion.'));
    }

    console.error(`Backend returned code ${error.status}, body was:`, error.error);
    
    // Handle validation errors (422)
    if (error.status === 422) {
      return throwError(() => error);
    }

    // Handle unauthorized (401)
    if (error.status === 401) {
      return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
    }

    return throwError(() => error);
  }

  addHealthData(data: HealthData): Observable<HealthData> {
    return this.http.post<HealthData>(`${this.API_URL}`, data,{headers})
      .pipe(
        retry({ count: environment.retryAttempts, delay: environment.retryDelay }),
        catchError(this.handleError)
      );
  }

  getHealthData(startDate?: string, endDate?: string): Observable<HealthData[]> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('start_date', startDate);
    }
    if (endDate) {
      params = params.set('end_date', endDate);
    }

    return this.http.get<HealthData[]>(this.API_URL, { params,headers })
      .pipe(
        retry({ count: environment.retryAttempts, delay: environment.retryDelay }),
        catchError(this.handleError)
      );
  }

  updateHealthData(id: number, data: Partial<HealthData>): Observable<HealthData> {
    return this.http.put<HealthData>(`${this.API_URL}/${id}`, data,{headers})
      .pipe(
        retry({ count: environment.retryAttempts, delay: environment.retryDelay }),
        catchError(this.handleError)
      );
  }

  deleteHealthData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`,{headers})
      .pipe(
        retry({ count: environment.retryAttempts, delay: environment.retryDelay }),
        catchError(this.handleError)
      );
  }
}