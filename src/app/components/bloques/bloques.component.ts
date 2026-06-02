import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BloquesService } from '../../services/bloques.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-bloques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bloques.component.html',
  styleUrls: ['./bloques.component.css']
})
export class BloquesComponent implements OnInit {
  private bloquesService = inject(BloquesService);
  private categoriasService = inject(CategoriasService);

  isEditMode: boolean = false;
  idInEdit: number | null = null;
  filterSearch: string = '';
  sortField: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  bloquesList: any[] = [];
  bloqueForm = {
    diaSemana: 0,
    horaInicio: "",
    horaFin: "",
    categoriaId: 0
  };
  categoriesList: any[] = [];
  

  ngOnInit() {
    this.loadBloques();
    this.categoriasService.getCategorias().subscribe(data => this.categoriesList = data)
  }

  resetForm() {
    this.isEditMode = false;
    this.idInEdit = null;
    this.bloqueForm = {
      diaSemana: 0,
      horaInicio: "",
      horaFin: "",
      categoriaId: 0
    };
  }

  selectToEdit(bloque: any) {
    this.isEditMode = true;
    this.idInEdit = bloque.id;
    this.bloqueForm = {
      diaSemana: bloque.diaSemana,
      horaInicio: bloque.horaInicio,
      horaFin: bloque.horaFin,
      categoriaId: bloque.categoriaId
    };
  }

  submitForm() {
    if (this.isEditMode) {
      this.updateBloque();
    } else {
      this.createBloque();
    }
  }

  toggleSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.bloquesList.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      // TRUCO: Si el usuario ordena por 'categoria', extraemos el NOMBRE dentro del objeto anidado
      if (field === 'categoria') {
        valueA = a.categoria?.nombre || '';
        valueB = b.categoria?.nombre || '';
      }

      // Si son textos, los pasamos a minúsculas para comparar simétricamente
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getDiaTexto(diaNumero: number): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[diaNumero] || '';
  }

  loadBloques() {
    this.bloquesService.getBloques().subscribe({
      next: (data) => {
        this.bloquesList = data;
        const currentField = this.sortField;
        this.sortField = '';
        this.toggleSort(currentField);
      },
      error: (err) => {
        console.error('Error al cargar bloques:', err);
      }
    });
  }

  createBloque() {
    this.bloquesService.createBloque(this.bloqueForm).subscribe({
      next: () => {
        this.loadBloques();
        this.resetForm();
      },
      error: (err) => console.error('Error al crear bloque:', err)
    });
  }

  updateBloque() {
    if (this.idInEdit !== null) {
      this.bloquesService.updateBloque(this.idInEdit, this.bloqueForm).subscribe({
        next: () => {
          this.loadBloques();
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar bloque:', err)
      });
    }
  }

  deleteBloque(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este bloque horario?')) {
      this.bloquesService.deleteBloque(id).subscribe({
        next: () => this.loadBloques(),
        error: (err) => console.error('Error al eliminar bloque:', err)
      });
    }
  }

}
