import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Property } from '../../models/property.model';
import { environment } from '../../../environments/enviroment';
import { Router } from '@angular/router';

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

  apiUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getImageUrl(fileName: string, size: 'thumb' | 'medium' | 'full' = 'full'): string {
    if (!fileName) return '';
    const prefix = size === 'thumb' ? 'thumb_'
      : size === 'medium' ? 'medium_'
        : '';
    return `${this.apiUrl}/uploads/${prefix}${fileName}`;
  }

  nextImage() {
    if (!this.property.urlsFotos?.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.property.urlsFotos.length;
  }

  prevImage() {
    if (!this.property.urlsFotos?.length) return;
    this.currentImageIndex = this.currentImageIndex === 0
      ? this.property.urlsFotos.length - 1
      : this.currentImageIndex - 1;
  }

  setImage(index: number) { this.currentImageIndex = index; }

  openLightbox(index: number) {
    this.lightboxImageIndex = index;
    this.showLightbox = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.showLightbox = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  nextLightboxImage() {
    if (!this.property.urlsFotos?.length) return;
    this.lightboxImageIndex = (this.lightboxImageIndex + 1) % this.property.urlsFotos.length;
  }

  prevLightboxImage() {
    if (!this.property.urlsFotos?.length) return;
    this.lightboxImageIndex = this.lightboxImageIndex === 0
      ? this.property.urlsFotos.length - 1
      : this.lightboxImageIndex - 1;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  trackByIndex(index: number): number { return index; }

  sendWhatsApp(): void {
    if (!this.property || !isPlatformBrowser(this.platformId)) return;
    const phone = '5518996312445';
    const ref = this.property.id ?? 'N/A';
    const titulo = this.property.titulo ?? 'Imóvel';
    const status = this.property.status ? this.property.status.toLowerCase() : '';
    const valor = this.formatPrice?.(this.property.valor) ?? '';
    const link = `https://barriosimobiliaria.com.br/imovel/${this.property.id}`;
    const msg = `Olá! Tenho interesse no imóvel.\n Referência: ${ref}\n ${titulo}\n`
      + (status ? ` Tipo: ${status}\n` : '')
      + (valor ? ` Valor: ${valor}\n` : '')
      + ` Link: ${link}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  get fotos(): string[] { return this.property?.urlsFotos ?? []; }

  verDetalhes() { this.router.navigate(['/imovel', this.property.id]); }
}
