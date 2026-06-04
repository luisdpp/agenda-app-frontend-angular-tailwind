import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas.service';
import { BloquesService } from '../../services/bloques.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  // 1. INJECTIONS
  private citasService = inject(CitasService);
  private bloquesService = inject(BloquesService);
  private categoriasService = inject(CategoriasService);

  // 2. COMPONENT STATE PROPERTIES
  categoriasList: any[] = [];
  bloquesDisponiblesList: any[] = []; // Guarda los bloques dinámicos del endpoint /disponibles
  citasList: any[] = [];
  loadingHorarios: boolean = false;
  userRole: string = '';

  // 3. DATA MODELS (Alineado estrictamente con tu modelo Cita de Prisma)
  citaForm = {
    fecha: '',
    categoriaId: 0,
    bloqueId: 0,
    usuarioId: 0
  };

  // 4. LIFECYCLE HOOKS
  ngOnInit() {
    this.cargarCategorias();
    this.cargarCitas();
    this.extraerUsuarioDesdeToken();

    const userData = localStorage.getItem('user');
    if (userData) {
      this.userRole = JSON.parse(userData).role;
    }
  }

  // 5. INTERNAL UTILITY & DATA FETCHING METHODS
  extraerUsuarioDesdeToken() {
    // Intentamos recuperar los datos del usuario logueado para asignar el usuarioId automáticamente
    const userData = localStorage.getItem('user'); // O donde guardes la info del usuario al hacer Login
    if (userData) {
      const usuario = JSON.parse(userData);
      this.citaForm.usuarioId = usuario.id;
    } else {
      // Como contingencia temporal si no tienes la info guardada, dejamos un ID por defecto para pruebas
      this.citaForm.usuarioId = 1; 
    }
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => this.categoriasList = data,
      error: (error) => console.error('Error al cargar categorías:', error)
    });
  }

  cargarCitas() {
    this.citasService.getCitas().subscribe({
      next: (data) => this.citasList = data,
      error: (error) => console.error('Error al cargar citas:', error)
    });
  }

  // Método gatillo reactivo conectado a los inputs mediante (change)
  disponiblidadOnChange() {
    if (this.citaForm.fecha && this.citaForm.categoriaId > 0) {
      this.loadingHorarios = true;
      this.bloquesDisponiblesList = [];
      this.citaForm.bloqueId = 0; // Forzamos a re-seleccionar horario

      // Consumimos el endpoint de disponibilidad dinámica que configuraste en Express usando fetch directo
      const url = `http://localhost:3000/api/bloques/disponibles?fecha=${this.citaForm.fecha}&categoriaId=${this.citaForm.categoriaId}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          this.bloquesDisponiblesList = data;
          this.loadingHorarios = false;
        })
        .catch(err => {
          console.error('Error al calcular disponibilidad:', err);
          this.loadingHorarios = false;
        });
    }
  }

  seleccionarHorario(bloqueId: number) {
    this.citaForm.bloqueId = bloqueId;
  }

  resetForm() {
    const currentUsuarioId = this.citaForm.usuarioId;
    this.citaForm = {
      fecha: '',
      categoriaId: 0,
      bloqueId: 0,
      usuarioId: currentUsuarioId
    };
    this.bloquesDisponiblesList = [];
  }

  // 6. BACKEND CRUD INTERACTIONS
  agendarCita() {
    // Convertimos la fecha plana "YYYY-MM-DD" a un objeto Date o string ISO compatible con el DateTime de Prisma si lo requiere
    this.citasService.createCita(this.citaForm).subscribe({
      next: (data) => {
        alert('✨ ¡Cita agendada exitosamente!');
        this.cargarCitas(); // Refresca la lista histórica
        this.resetForm();   // Resetea la pantalla
      },
      error: (error) => {
        console.error('Error al agendar cita:', error);
        alert('❌ Error: ' + (error.error?.mensaje || 'Ya tienes una cita agendada en este mismo horario y fecha.'));
      }
    });
  }
}