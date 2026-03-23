import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { Property } from '../../models/property.model';
import { environment } from '../../../environments/enviroment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  isLoading = true;
  currentImageIndex = 0;
  showLightbox = false;
  lightboxImageIndex = 0;

  apiUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/']); return; }

    this.propertyService.buscarPorId(Number(id)).subscribe({
      next: (property) => {
        this.property = property;
        this.isLoading = false;
        this.setMetaTags(property);
        this.setSchemaOrg(property);
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  private setMetaTags(p: Property) {
    const cidade = p.cidade ?? p.endereco?.cidade ?? '';
    const bairro = p.endereco?.bairro ?? '';
    const tipo = p.tipoImovel?.toLowerCase() ?? 'imóvel';
    const status = p.status?.toLowerCase() === 'venda' ? 'à venda' : 'para alugar';
    const preco = this.formatPrice(p.valor);
    const titulo = `${p.titulo} | Barrios Imobiliária`;
    const descricao = p.descricao
      ? p.descricao.slice(0, 155) + '...'
      : `${p.tipoImovel} ${status} em ${bairro}, ${cidade}. ${preco}. Confira fotos e detalhes na Barrios Imobiliária.`;
    const keywords = [
      tipo, status, bairro, cidade,
      `${tipo} ${status}`, `${tipo} ${status} ${cidade}`,
      `${tipo} ${status} ${bairro}`, `imóvel ${status} ${cidade}`,
      'imobiliária', 'Barrios Imobiliária',
      `${p.quartos ? p.quartos + ' quartos' : ''}`,
      `${p.areaTotal ? p.areaTotal + 'm²' : ''}`,
    ].filter(Boolean).join(', ');
    const imagem = p.urlsFotos?.length ? `${this.apiUrl}/uploads/${p.urlsFotos[0]}` : '';
    const url = `https://barriosimobiliaria.com.br/imovel/${p.id}`;

    this.title.setTitle(titulo);
    this.meta.updateTag({ name: 'description', content: descricao });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: titulo });
    this.meta.updateTag({ property: 'og:description', content: descricao });
    this.meta.updateTag({ property: 'og:image', content: imagem });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'pt_BR' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: titulo });
    this.meta.updateTag({ name: 'twitter:description', content: descricao });
    this.meta.updateTag({ name: 'twitter:image', content: imagem });
  }

  private setSchemaOrg(p: Property) {
    if (!isPlatformBrowser(this.platformId)) return;

    const existing = document.getElementById('schema-imovel');
    if (existing) existing.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": p.titulo,
      "description": p.descricao ?? '',
      "url": `https://barriosimobiliaria.com.br/imovel/${p.id}`,
      "image": p.urlsFotos?.map(f => `${this.apiUrl}/uploads/${f}`) ?? [],
      "offers": {
        "@type": "Offer",
        "price": p.valor,
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "businessFunction": p.status === 'VENDA'
          ? "https://schema.org/Sell"
          : "https://schema.org/LeaseOut"
      },
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": p.areaTotal,
        "unitCode": "MTK"
      },
      "numberOfRooms": p.quartos ?? 0,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": p.endereco?.logradouro ?? '',
        "addressLocality": p.cidade ?? '',
        "addressRegion": "SP",
        "addressCountry": "BR"
      }
    };

    const script = document.createElement('script');
    script.id = 'schema-imovel';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  getImageUrl(fileName: string, size: 'thumb' | 'medium' | 'full' = 'full'): string {
    if (!fileName) return '';
    const prefix = size === 'thumb' ? 'thumb_'
      : size === 'medium' ? 'medium_'
        : '';
    return `${this.apiUrl}/uploads/${prefix}${fileName}`;
  }

  setImage(index: number) { this.currentImageIndex = index; }

  nextImage() {
    if (!this.property?.urlsFotos?.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.property.urlsFotos.length;
  }

  prevImage() {
    if (!this.property?.urlsFotos?.length) return;
    this.currentImageIndex = this.currentImageIndex === 0
      ? this.property.urlsFotos.length - 1
      : this.currentImageIndex - 1;
  }

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
    if (!this.property?.urlsFotos?.length) return;
    this.lightboxImageIndex = (this.lightboxImageIndex + 1) % this.property.urlsFotos.length;
  }

  prevLightboxImage() {
    if (!this.property?.urlsFotos?.length) return;
    this.lightboxImageIndex = this.lightboxImageIndex === 0
      ? this.property.urlsFotos.length - 1
      : this.lightboxImageIndex - 1;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  sendWhatsApp() {
    if (!this.property || !isPlatformBrowser(this.platformId)) return;
    const phone = '5518996312445';
    const url = `https://barriosimobiliaria.com.br/imovel/${this.property.id}`;
    const msg = `Olá! Tenho interesse no imóvel.\n Referência: ${this.property.id}\n ${this.property.titulo}\n Valor: ${this.formatPrice(this.property.valor)}\n Link: ${url}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  voltar() {
    this.router.navigate(['/'], { fragment: 'properties' });
  }
}
