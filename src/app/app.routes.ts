import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyFormComponent } from './components/property-form/property-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { PropertyCategoryComponent } from './components/property-category/property-category.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imovel/:id', component: PropertyDetailComponent },
  { path: 'imoveis/:slug', component: PropertyCategoryComponent }, // ← nova rota

  { path: 'cadastrar-imovel', component: PropertyFormComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];
