import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyFormComponent } from './components/property-form/property-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastrar-imovel', component: PropertyFormComponent },
  { path: '**', redirectTo: '' } 
];
