import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class BloquesService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bloques`;

  getBloques(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createBloque(bloque: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(this.apiUrl, bloque, { headers: headers });
    } else {
      console.error('No se encontró token de autenticación'); 
      return new Observable(observer => {
        observer.error('No se encontró token de autenticación');
      });
    }
  }

  updateBloque(id: number, bloque: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put<any>(`${this.apiUrl}/${id}`, bloque, { headers: headers });
    } else {
      console.error('No se encontró token de autenticación');
      return new Observable(observer => {
        observer.error('No se encontró token de autenticación');
      });
    } 
  }

  deleteBloque(id: number): Observable<any> {   
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: headers });
    } else {
      console.error('No se encontró token de autenticación');
      return new Observable(observer => {
        observer.error('No se encontró token de autenticación');
      });
    }
  }
}
