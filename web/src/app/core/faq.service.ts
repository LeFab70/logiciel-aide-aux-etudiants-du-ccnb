import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Faq } from './models';

export type FaqRequest = Omit<Faq, 'id'>;

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly http = inject(HttpClient);

  list(campusId?: number): Observable<Faq[]> {
    const url = campusId
      ? `${environment.apiUrl}/faq?campusId=${campusId}`
      : `${environment.apiUrl}/faq`;
    return this.http.get<Faq[]>(url);
  }

  create(request: FaqRequest): Observable<Faq> {
    return this.http.post<Faq>(`${environment.apiUrl}/admin/faq`, request);
  }

  update(id: number, request: FaqRequest): Observable<Faq> {
    return this.http.put<Faq>(`${environment.apiUrl}/admin/faq/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/faq/${id}`);
  }
}
