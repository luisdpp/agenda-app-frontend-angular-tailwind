import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private http = inject(HttpClient);
  private apiUrl =`${environment.apiUrl}/citas`;

  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCita(cita: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(this.apiUrl, cita, { headers: headers });
    } else {
      console.error('No se encontró token de autenticación');
      return new Observable(observer => {
        observer.error('No se encontró token de autenticación');
      });
    }
  }
}
