import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
  })
export class CategoriasComponent implements OnInit {
  // 1. SERVICES INJECTION
  private categoriasService = inject(CategoriasService);

  // 2. COMPONENT STATE PROPERTIES
  isEditMode: boolean = false;
  idInEdit: number | null = null;
  filterSearch: string = '';
  sortField: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  // 3. DATA MODELS
  categoriesList: any[] = [];
  categoryForm = {
    nombre: '',
    limitePorBloque: 0
  };

  // 4. LIFECYCLE HOOKS
  ngOnInit() {
    this.loadCategories();
  }

  // 5. INTERNAL UTILITY METHODS
  resetForm() {
    this.isEditMode = false;
    this.idInEdit = null;
    this.categoryForm = {
      nombre: '',
      limitePorBloque: 0
    };
  }

  selectToEdit(category: any) {
    this.isEditMode = true;
    this.idInEdit = category.id;
    this.categoryForm = {
      nombre: category.nombre,
      limitePorBloque: category.limitePorBloque
    };
  }

  // 6. FORM SUBMISSION HANDLER (The Gatekeeper)
  submitForm() {
    if (this.isEditMode) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  toggleSort(field: string) {
    // Si da clic en el mismo campo, alterna la dirección. Si es un campo nuevo, inicia en 'asc'
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    // Algoritmo nativo de ordenamiento en JavaScript
    this.categoriesList.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      // Si es texto (como el nombre), lo pasamos a minúsculas para comparar bien
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 7. API SERVICE COMMUNICATIONS
  loadCategories() {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categoriesList = data;
        // Mantiene el orden actual activo al recargar los datos
        const currentField = this.sortField;
        this.sortField = ''; // Reset temporal para forzar el ordenamiento
        this.toggleSort(currentField);
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  createCategory() {
    console.log('Creation Mode: Saving data...');
    this.categoriasService.createCategoria(this.categoryForm).subscribe({
      next: () => {
        this.loadCategories();
        this.resetForm(); // Centralizado y limpio
      },
      error: (err) => console.error('Error creating category:', err)
    });
  }

  updateCategory() {
    console.log('Edition Mode: Updating ID ->', this.idInEdit, this.categoryForm);
    if (this.idInEdit !== null) {
      this.categoriasService.updateCategoria(this.idInEdit, this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
        },
        error: (err) => console.error('Error updating category:', err)
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        this.categoriasService.deleteCategoria(id).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: (err) => console.error('Error deleting category:', err)
        });
    }
  }
}