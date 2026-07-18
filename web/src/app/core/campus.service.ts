import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Campus } from './models';

@Injectable({ providedIn: 'root' })
export class CampusService {
  private readonly http = inject(HttpClient);

  list(): Observable<Campus[]> {
    return this.http.get<Campus[]>(`${environment.apiUrl}/campuses`);
  }
}
