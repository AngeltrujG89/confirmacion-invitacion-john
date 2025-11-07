import { Routes } from '@angular/router';
import { FormularioRegistroComponent } from './formulario-registro/formulario-registro.component';

export const routes: Routes = [
    { path: '', component: FormularioRegistroComponent },
    { path: '**', redirectTo: '' },
];  
