import { Component, inject, OnInit } from '@angular/core'; // IMPORTANTE: Agregado OnInit
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BaseChartDirective],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit { // 🔥 CORREGIDO: Declaramos que implementa OnInit
  private authService = inject(AuthService);
  private router = inject(Router);
  userRole: string = '';

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const usuario = JSON.parse(userData);
      this.userRole = usuario.role; 
      console.log('Rol del usuario cargado en el Layout:', this.userRole); // Para que verifiques en consola
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}