import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com reticências
      const startPage = Math.max(0, this.currentPage - 2);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
      
      // Sempre mostrar primeira página
      if (startPage > 0) {
        pages.push(0);
        if (startPage > 1) {
          pages.push(-1); // -1 representa reticências
        }
      }
      
      // Páginas do meio
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Sempre mostrar última página
      if (endPage < this.totalPages - 1) {
        if (endPage < this.totalPages - 2) {
          pages.push(-1); // -1 representa reticências
        }
        pages.push(this.totalPages - 1);
      }
    }
    
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToFirstPage(): void {
    if (this.currentPage !== 0) {
      this.pageChange.emit(0);
    }
  }

  goToLastPage(): void {
    if (this.currentPage !== this.totalPages - 1) {
      this.pageChange.emit(this.totalPages - 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}