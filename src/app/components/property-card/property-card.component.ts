import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/property.model';


@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {
  @Input() property!: Property;

  currentImageIndex = 0;
  showLightbox = false;
  lightboxImageIndex = 0;

  // Ajustado para usar 'urlsFotos'
  nextImage() {
    if (this.property.urlsFotos && this.property.urlsFotos.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.urlsFotos.length;
    }
  }

  // Ajustado para usar 'urlsFotos'
  prevImage() {
    if (this.property.urlsFotos && this.property.urlsFotos.length) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.property.urlsFotos.length - 1
        : this.currentImageIndex - 1;
    }
  }

  setImage(index: number) {
    this.currentImageIndex = index;
  }

  openLightbox(index: number) {
    this.lightboxImageIndex = index;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.showLightbox = false;
    document.body.style.overflow = 'auto';
  }


  // Ajustado para usar 'urlsFotos'
  nextLightboxImage() {
    if (this.property.urlsFotos) {
      this.lightboxImageIndex = (this.lightboxImageIndex + 1) % this.property.urlsFotos.length;
    }
  }

  // Ajustado para usar 'urlsFotos'
  prevLightboxImage() {
    if (this.property.urlsFotos) {
      this.lightboxImageIndex = this.lightboxImageIndex === 0
        ? this.property.urlsFotos.length - 1
        : this.lightboxImageIndex - 1;
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  sendWhatsApp() {
    // Ajustado para 'titulo' e 'valor'
    const message = `Olá! Tenho interesse no imóvel: ${this.property.titulo} - ${this.formatPrice(this.property.valor)}`;
    const url = `https://wa.me/5518996312445?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}