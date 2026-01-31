import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../services/admin.service';
import { Property } from '../../models/property.model';
import { PropertyFormComponent } from '../../components/property-form/property-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PropertyFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // Tabela paginada
  properties: Property[] = [];
  page = 0;
  size = 10;
  totalPages = 0;

  // Totais de todos os imóveis
  totalCasas = 0;
  totalApartamentos = 0;
  totalTerrenos = 0;
  totalChacaras = 0;
  totalBarracao = 0;
  totalSitio = 0;

  // Modais
  showForm = false;
  editingProperty: Property | null = null;
  showDeleteConfirm = false;
  propertyToDelete: Property | null = null;

  // Filtros
  filters = {
    nome: '',
    tipoImovel: '',
    status: ''
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadTotals();  // Carrega totais de todos os imóveis
    this.buscar(0);      // Carrega primeira página da tabela
  }

  /** ================= Totais ================= */
  loadTotals(): void {
    this.adminService.getTotals().subscribe({
      next: (totais) => {
        console.log('Totais recebidos do backend:', totais); // <<== debug
        this.totalCasas = totais['CASA'] || 0;
        this.totalApartamentos = totais['APARTAMENTO'] || 0;
        this.totalTerrenos = totais['TERRENO'] || 0;
        this.totalChacaras = totais['CHACARA'] || 0;
        this.totalBarracao = totais['BARRACAO'] || 0;
        this.totalSitio = totais['SITIO'] || 0;
      },
      error: (err) => console.error('Erro ao buscar totais:', err)
    });
  }

  /** ================= Formulário ================= */
  openAddForm(): void {
    this.editingProperty = null;
    this.showForm = true;
  }

  openEditForm(property: Property): void {
    this.editingProperty = { ...property };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingProperty = null;
  }

  onPropertySaved(): void {
    this.buscar(this.page);  // recarrega a página atual
    this.loadTotals();       // atualiza os totais
    this.closeForm();
  }

  /** ================= Exclusão ================= */
  confirmDelete(property: Property): void {
    this.propertyToDelete = property;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.propertyToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteProperty(): void {
    if (!this.propertyToDelete?.id) {
      console.error('Nenhum imóvel selecionado!');
      return;
    }

    this.adminService.deleteImovel(this.propertyToDelete.id).subscribe({
      next: () => {
        this.buscar(this.page);  // recarrega página atual
        this.loadTotals();       // atualiza totais
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Erro ao deletar imóvel:', err);
        alert('Não foi possível excluir o imóvel. Pode haver imagens vinculadas.');
      }
    });
  }

  /** ================= Tabela ================= */
  buscar(page: number = 0): void {
    this.page = page;
    this.adminService.buscarTabela(this.filters, this.page, this.size).subscribe({
      next: (res) => {
        this.properties = res.content;
        this.totalPages = res.totalPages;
      },
      error: (err) => console.error('Erro ao buscar imóveis da tabela:', err)
    });
  }

  limparFiltros(): void {
    this.filters = { nome: '', tipoImovel: '', status: '' };
    this.buscar(0);
  }

  changePage(page: number): void {
    this.buscar(page);
  }

  /** ================= Labels ================= */
  getTipoImovelLabel(tipo: string): string {
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

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      VENDA: 'Venda',
      ALUGUEL: 'Aluguel',
      DISPONIVEL: 'Disponível'
    };
    return map[status] || status;
  }

  /** ================= Fotos ================= */
  getPhotoUrl(property: Property, index: number = 0): string {
    if (property.urlsFotos?.length) {
      return `http://localhost:8080/uploads/${property.urlsFotos[index]}`;
    }
    return 'assets/images/sem-imagem.jpg';
  }

  getTotalImoveis(): number {
    return this.totalCasas + this.totalApartamentos + this.totalTerrenos +
      this.totalChacaras + this.totalBarracao + this.totalSitio;
  }

}
