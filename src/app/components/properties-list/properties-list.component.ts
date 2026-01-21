import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { Property, TipoImovel, StatusImovel } from '../../models/property.model';
import { PropertyService } from '../../services/property-service';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css'
})
export class PropertiesListComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  
  // Filtros
  selectedType: string = 'todos'; // Vai mapear para TipoImovel
  selectedTransaction: string = 'todos'; // Vai mapear para StatusImovel
  selectedBedrooms: string = 'todos';
  minPrice: number = 0;
  maxPrice: number = 10000000;
  
  isLoading = true; // Para mostrar um "carregando..."

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.isLoading = true;
    // Aqui buscamos a primeira página (você pode melhorar a paginação depois)
    this.propertyService.buscar({}).subscribe({
      next: (page) => {
        this.properties = page.content;
        this.filteredProperties = this.properties;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar imóveis', err);
        this.isLoading = false;
      }
    });
  }

  // --- Lógica de Filtro Local (Filtra o que já baixou) ---
  
  filterByType(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.properties;
    
    // 1. Filtrar por Tipo (CASA, APARTAMENTO...)
    if (this.selectedType !== 'todos') {
      filtered = filtered.filter(p => p.tipoImovel === this.selectedType as TipoImovel);
    }
    
    // 2. Filtrar por Status (VENDA, ALUGUEL...)
    if (this.selectedTransaction !== 'todos') {
      filtered = filtered.filter(p => p.status === this.selectedTransaction as StatusImovel);
    }
    
    // 3. Filtrar por Quartos
    if (this.selectedBedrooms !== 'todos') {
      const bedroomCount = parseInt(this.selectedBedrooms);
      filtered = filtered.filter(p => p.quartos && p.quartos >= bedroomCount);
    }
    
    // 4. Filtrar por Valor
    filtered = filtered.filter(p => p.valor >= this.minPrice && p.valor <= this.maxPrice);
    
    this.filteredProperties = filtered;
  }
  
  onTransactionChange(event: Event) {
    this.selectedTransaction = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }
  
  onBedroomsChange(event: Event) {
    this.selectedBedrooms = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }
  
  onPriceRangeChange(event: Event, type: 'min' | 'max') {
    const value = parseInt((event.target as HTMLSelectElement).value);
    if (type === 'min') {
      this.minPrice = value;
    } else {
      this.maxPrice = value;
    }
    this.applyFilters();
  }

  resetFilters() {
    this.selectedType = 'todos';
    this.selectedTransaction = 'todos';
    this.selectedBedrooms = 'todos';
    this.minPrice = 0;
    this.maxPrice = 10000000;
    this.applyFilters();
  }
}