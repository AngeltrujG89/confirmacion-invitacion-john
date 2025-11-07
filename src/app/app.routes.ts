import { Routes } from '@angular/router';
import { FormularioRegistroComponent } from './formulario-registro/formulario-registro.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: FormularioRegistroComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '' },

];  
