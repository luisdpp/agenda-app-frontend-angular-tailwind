import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categorias`;

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCategoria(categoria: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(this.apiUrl, categoria, { headers: headers });
    } else {
      console.error('No se encontró token de autenticación');
      return new Observable(observer => {
        observer.error('No se encontró token de autenticación');
      });
    }
  }

  updateCategoria(id: number, categoria: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put<any>(`${this.apiUrl}/${id}`, categoria, { headers: headers });
    } else {
      console.error('No se encontró token de autenticación');
      return new Observable(observer => {
        observer.error('No se encontró token de autenticación');
      });
    }
  }

  deleteCategoria(id: number): Observable<any> {
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
