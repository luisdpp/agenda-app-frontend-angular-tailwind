import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { BloquesComponent } from './components/bloques/bloques.component';
import { CitasComponent } from './components/citas/citas.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },

    { path: 'dashboard', 
        component: DashboardLayoutComponent, 
        children: [
            { path: '', redirectTo: 'categorias', pathMatch: 'full' },

            { path: 'inicio', component: DashboardComponent },
            { path: 'categorias', component: CategoriasComponent },
            { path: 'bloques', component: BloquesComponent },
            { path: 'citas', component: CitasComponent }
        ] 
    }
];
