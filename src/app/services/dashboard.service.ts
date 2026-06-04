import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  // Apunta directamente al endpoint analítico que creaste en tu Express
  private apiUrl = `${environment.apiUrl}/dashboard/stats`;

  getMetrics(): Observable<any> {
    // Capturamos el token del administrador del almacenamiento local
    const token = localStorage.getItem('token');
    
    // Configuramos la cabecera de autorización para que el middleware de Express nos deje pasar
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
    
    // Disparamos la petición HTTP GET de forma asíncrona
    return this.http.get<any>(this.apiUrl, { headers });
  }
}