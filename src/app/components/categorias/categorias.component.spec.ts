import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriasComponent } from './categorias.component';
import { CategoriasService } from '../../services/categorias.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('CategoriasComponent', () => {
  let component: CategoriasComponent;
  let fixture: ComponentFixture<CategoriasComponent>;
  
  // Creamos un "Simulador" (Mock) del servicio para no pegarle a la base de datos real en los tests
  const mockCategoriasService = {
    getCategorias: () => of([]), // Simula que el GET devuelve un array vacío de inmediato
    createCategoria: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasComponent, FormsModule],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara el ngOnInit inicial
  });

  // PRUEBA 1: Verificar que el componente se crea bien
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // PRUEBA 2: Verificar que resetForm() limpia todo
  it('should clear form data and turn off edit mode when resetForm() is called', () => {
    // 1. Ensuciamos el componente emulando que el usuario estaba editando algo
    component.isEditMode = true;
    component.idInEdit = 99;
    component.categoryForm = { nombre: 'Masajes', limitePorBloque: 5 };

    // 2. Ejecutamos la función que queremos testear
    component.resetForm();

    // 3. Evaluamos las expectativas (Expects)
    expect(component.isEditMode).toBeFalse();
    expect(component.idInEdit).toBeNull();
    expect(component.categoryForm.nombre).toBe('');
    expect(component.categoryForm.limitePorBloque).toBe(0);
  });
});