import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { BloquesComponent } from './components/bloques/bloques.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },

    { path: 'dashboard', 
        component: DashboardLayoutComponent, 
        children: [
            { path: '', redirectTo: 'categorias', pathMatch: 'full' },

            { path: 'categorias', component: CategoriasComponent },
            { path: 'bloques', component: BloquesComponent },
        ] 
    }
];
