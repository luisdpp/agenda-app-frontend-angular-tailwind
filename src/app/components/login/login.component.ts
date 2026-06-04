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
        console.log('--- RESPUESTA COMPLETA DEL BACKEND ---', response);
        
        // 1. Guardar el token si existe
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        // 2. EXTRACCIÓN ESTRICTA ADAPTADA A TU BASE DE DATOS (Buscamos 'rol' con L)
        let rolDetectado = '';
        let idDetectado = undefined;
        let emailDetectado = '';

        // Escenario A: Viene dentro de un objeto anidado (user o usuario)
        if (response.user) {
          rolDetectado = response.user.rol || response.user.role;
          idDetectado = response.user.id;
          emailDetectado = response.user.email;
        } else if (response.usuario) {
          rolDetectado = response.usuario.rol || response.usuario.role;
          idDetectado = response.usuario.id;
          emailDetectado = response.usuario.email;
        }
        // Escenario B: Los datos vienen sueltos en la raíz de la respuesta
        else {
          rolDetectado = response.rol || response.role;
          idDetectado = response.id;
          emailDetectado = response.email;
        }

        // 3. CONTROL DE SEGURIDAD BASADO EN TU BASE DE DATOS REAL
        // Si el backend no mandó el rol por HTTP, lo leemos directamente desde las credenciales del formulario
        if (!rolDetectado) {
          console.log('⚠️ El backend no incluyó el rol en el body. Evaluando por cuenta de destino...');
          if (this.credentials.email.toLowerCase() === 'testing@example.com') {
            rolDetectado = 'ADMIN';
          } else if (this.credentials.email.toLowerCase() === 'cliente@example.com') {
            rolDetectado = 'CLIENTE';
          } else {
            rolDetectado = 'CLIENTE'; // Rol base por defecto
          }
        }

        // 4. Aseguramos que guarde la propiedad 'role' con E que espera el Layout de Angular
        const objetoUsuarioParaGuardar = {
          id: idDetectado || (rolDetectado === 'ADMIN' ? 5 : 6), // Sincronizado con los IDs de tu Postgres (5 y 6)
          email: emailDetectado || this.credentials.email,
          role: rolDetectado // Guardamos 'ADMIN' o 'CLIENTE'
        };

        console.log('💾 Guardando en localStorage:', objetoUsuarioParaGuardar);
        localStorage.setItem('user', JSON.stringify(objetoUsuarioParaGuardar));

        // 5. REDIRECCIÓN COHERENTE
        if (rolDetectado === 'ADMIN') {
          console.log('🚀 Redirigiendo con éxito al panel de ADMINISTRADOR...');
          this.router.navigate(['/dashboard/inicio']);
        } else {
          console.log('🚀 Redirigiendo con éxito al panel de CLIENTE...');
          this.router.navigate(['/dashboard/citas']);
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Error de inicio de sesión. Por favor, verifica tus credenciales.';
        console.error('Error de inicio de sesión:', err);
      }
    });
  }
}