import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/property.model';
import { environment } from '../../../environments/enviroment';

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
  lightboxImageIndex = 0;
  showLightbox = false;

  // Base da API (produção / dev)
  apiUrl = environment.apiUrl.replace(/\/$/, '');

  /** Monta URL da imagem */
  getImageUrl(fileName: string): string {
    return `${this.apiUrl}/uploads/${fileName}`;
  }

  nextImage() {
    if (!this.property.urlsFotos?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.property.urlsFotos.length;
  }

  prevImage() {
    if (!this.property.urlsFotos?.length) return;
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.property.urlsFotos.length - 1
        : this.currentImageIndex - 1;
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

  nextLightboxImage() {
    if (!this.property.urlsFotos?.length) return;
    this.lightboxImageIndex =
      (this.lightboxImageIndex + 1) % this.property.urlsFotos.length;
  }

  prevLightboxImage() {
    if (!this.property.urlsFotos?.length) return;
    this.lightboxImageIndex =
      this.lightboxImageIndex === 0
        ? this.property.urlsFotos.length - 1
        : this.lightboxImageIndex - 1;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  sendWhatsApp() {
    const message = `Olá! Tenho interesse no imóvel: ${this.property.titulo} - ${this.formatPrice(this.property.valor)}`;
    window.open(
      `https://wa.me/5518996312445?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  }

  get fotos(): string[] {
  return this.property?.urlsFotos ?? [];
}

}
