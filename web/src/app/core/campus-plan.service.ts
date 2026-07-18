import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CampusPlan, PlanPoint } from './models';

export type CampusPlanRequest = { imageUrl: string | null; description: string | null };
export type PlanPointRequest = Omit<PlanPoint, 'id'>;

@Injectable({ providedIn: 'root' })
export class CampusPlanService {
  private readonly http = inject(HttpClient);

  get(campusId: number): Observable<CampusPlan> {
    return this.http.get<CampusPlan>(`${environment.apiUrl}/campus-plan/${campusId}`);
  }

  upsert(campusId: number, request: CampusPlanRequest): Observable<CampusPlan> {
    return this.http.post<CampusPlan>(`${environment.apiUrl}/admin/campus-plan/${campusId}`, request);
  }

  addPoint(campusId: number, request: PlanPointRequest): Observable<PlanPoint> {
    return this.http.post<PlanPoint>(`${environment.apiUrl}/admin/campus-plan/${campusId}/points`, request);
  }

  updatePoint(campusId: number, pointId: number, request: PlanPointRequest): Observable<PlanPoint> {
    return this.http.put<PlanPoint>(
      `${environment.apiUrl}/admin/campus-plan/${campusId}/points/${pointId}`,
      request,
    );
  }

  deletePoint(campusId: number, pointId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/campus-plan/${campusId}/points/${pointId}`);
  }
}
