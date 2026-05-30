import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  alEnviarFormulario() {
    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Inicio de sesión exitoso:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.errorMessage = 'Error de inicio de sesión. Por favor, verifica tus credenciales.';
        console.error('Error de inicio de sesión:', err);
      }
    });
  }
}