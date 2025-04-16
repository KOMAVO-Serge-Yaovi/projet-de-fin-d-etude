import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HealthData {
  id?: number;
  user_id: number;
  date: string;
  sleep_duration?: number;
  sleep_quality?: number;
  exercise_duration?: number;
  exercise_type?: string;
  calories_burned?: number;
  calories_consumed?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HealthDataService {
  private readonly API_URL = `${environment.apiUrl}/api/health`;

  constructor(private http: HttpClient) {}

  addHealthData(data: HealthData): Observable<HealthData> {
    return this.http.post<HealthData>(`${this.API_URL}`, data);
  }

  getHealthData(startDate?: string, endDate?: string): Observable<HealthData[]> {
    let url = `${this.API_URL}`;
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      url += `?${params.toString()}`;
    }
    return this.http.get<HealthData[]>(url);
  }

  updateHealthData(id: number, data: Partial<HealthData>): Observable<HealthData> {
    return this.http.put<HealthData>(`${this.API_URL}/${id}`, data);
  }

  deleteHealthData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}