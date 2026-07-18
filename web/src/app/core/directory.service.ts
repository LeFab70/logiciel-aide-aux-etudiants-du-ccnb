import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DirectoryContact } from './models';

export type DirectoryContactRequest = Omit<DirectoryContact, 'id'>;

@Injectable({ providedIn: 'root' })
export class DirectoryService {
  private readonly http = inject(HttpClient);

  list(campusId: number): Observable<DirectoryContact[]> {
    return this.http.get<DirectoryContact[]>(`${environment.apiUrl}/directory?campusId=${campusId}`);
  }

  create(request: DirectoryContactRequest): Observable<DirectoryContact> {
    return this.http.post<DirectoryContact>(`${environment.apiUrl}/admin/directory`, request);
  }

  update(id: number, request: DirectoryContactRequest): Observable<DirectoryContact> {
    return this.http.put<DirectoryContact>(`${environment.apiUrl}/admin/directory/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/directory/${id}`);
  }
}
