import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { PropertyService } from '../../services/property-service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, PaginationComponent],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css'
})
export class PropertiesListComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];

  // Paginação
  currentPage: number = 0;
  pageSize: number = 12;
  totalPages: number = 0;
  totalElements: number = 0;
  onlyCommercial: boolean = false;

  // Filtros
  selectedType: string = 'todos';
  selectedTransaction: string = 'todos';
  selectedBedrooms: string = 'todos';
  minPrice: number = 0;
  maxPrice: number = 1000000000;

  isLoading = true;

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
    this.loadProperties(0);
  }

  // -----------------------------
  // Busca paginada + filtrada
  // -----------------------------
  loadProperties(page: number = 0) {
    this.isLoading = true;
    this.currentPage = page;

    const filtros = this.buildFilters();

    this.propertyService.buscar(filtros, page, this.pageSize).subscribe({
      next: (pageResponse) => {
        this.properties = pageResponse.content;
        this.filteredProperties = pageResponse.content; // ✅ aqui já vem filtrado do backend

        this.totalPages = pageResponse.totalPages;
        this.totalElements = pageResponse.totalElements;
        this.currentPage = pageResponse.number;

        this.isLoading = false;
        this.scrollToTop();
      },
      error: (err) => {
        console.error('Erro ao buscar imóveis', err);
        this.isLoading = false;
      }
    });
  }

  private buildFilters() {
    return {
      tipoImovel: this.selectedType !== 'todos' ? this.selectedType : undefined,
      status: this.selectedTransaction !== 'todos' ? this.selectedTransaction : undefined,
      quartos: this.selectedBedrooms !== 'todos'
        ? parseInt(this.selectedBedrooms, 10)
        : undefined,
      valorMin: this.minPrice > 0 ? this.minPrice : undefined,
      valorMax: this.maxPrice < 1000000000 ? this.maxPrice : undefined,
      isComercial: this.onlyCommercial ? true : undefined,
    };
  }


  // -----------------------------
  // Paginação
  // -----------------------------
  onPageChange(page: number) {
    this.loadProperties(page);
  }

  // -----------------------------
  // Filtros (sempre reset page 0)
  // -----------------------------
  private onAnyFilterChanged() {
    this.loadProperties(0);
  }

  filterByType(type: string) {
    this.selectedType = type;
    this.onlyCommercial = false;
    this.onAnyFilterChanged();
  }


  onTransactionChange(event: Event) {
    this.selectedTransaction = (event.target as HTMLSelectElement).value;
    this.onAnyFilterChanged();
  }

  onBedroomsChange(event: Event) {
    this.selectedBedrooms = (event.target as HTMLSelectElement).value;
    this.onAnyFilterChanged();
  }

  onPriceRangeChange(event: Event, type: 'min' | 'max') {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);

    if (type === 'min') this.minPrice = value;
    else this.maxPrice = value;

    this.onAnyFilterChanged();
  }

  resetFilters() {
    this.selectedType = 'todos';
    this.selectedTransaction = 'todos';
    this.selectedBedrooms = 'todos';
    this.minPrice = 0;
    this.maxPrice = 1000000000;
    this.onlyCommercial = false; // ✅ importante
    this.loadProperties(0);
  }



  // -----------------------------
  // UX
  // -----------------------------
  scrollToTop() {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  toggleCommercial() {
    this.onlyCommercial = true;     // ✅ força comercial
    this.selectedType = 'todos';    // ✅ limpa tipo
    this.onAnyFilterChanged();
  }


}
