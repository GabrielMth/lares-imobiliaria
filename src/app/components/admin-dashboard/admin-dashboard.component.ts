import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Property } from '../../models/property.model';
import { PropertyFormComponent } from '../../components/property-form/property-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PropertyFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  properties: Property[] = [];
  showForm = false;
  editingProperty: Property | null = null;
  showDeleteConfirm = false;
  propertyToDelete: Property | null = null;
  totalCasas = 0;
  totalApartamentos = 0;
  totalTerrenos = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.calcularStats();
  }

  private calcularStats() {
    this.totalCasas = this.properties.filter(p => p.tipoImovel === 'CASA').length;
    this.totalApartamentos = this.properties.filter(p => p.tipoImovel === 'APARTAMENTO').length;
    this.totalTerrenos = this.properties.filter(p => p.tipoImovel === 'TERRENO').length;
  }

  openAddForm() {
    this.editingProperty = null;
    this.showForm = true;
  }

  openEditForm(property: Property) {
    // copia para não editar direto o item da lista
    this.editingProperty = { ...property };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingProperty = null;
  }

  onPropertySaved() {
    this.loadProperties();
    this.closeForm();
  }

  confirmDelete(property: Property) {
    this.propertyToDelete = property;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.propertyToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteProperty() {
    if (!this.propertyToDelete) return;

    this.loadProperties();
    this.cancelDelete();
  }

  // ===== Labels (compatível com seu enum) =====

  getTipoImovelLabel(tipo: Property['tipoImovel'] | string): string {
    const map: Record<string, string> = {
      CASA: 'Casa',
      APARTAMENTO: 'Apartamento',
      TERRENO: 'Terreno',
      CHACARA: 'Chácara',
      BARRACAO: 'Barracão',
      SITIO: 'Sítio'
    };
    return map[tipo] || tipo;
  }

  getStatusLabel(status: Property['status'] | string): string {
    const map: Record<string, string> = {
      VENDA: 'Venda',
      ALUGUEL: 'Aluguel',
      DISPONIVEL: 'Disponível'
    };
    return map[status] || status;
  }



}
