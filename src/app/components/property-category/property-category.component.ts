import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property-service';
import { Property } from '../../models/property.model';
import { environment } from '../../../environments/enviroment';

// Mapa de slugs para filtros e textos SEO
const SLUG_CONFIG: Record<string, {
  titulo: string;
  descricao: string;
  h1: string;
  tipoImovel?: string;
  status?: string;
  cidade: string;
}> = {
  'casas-venda-assis': {
    titulo: 'Casas à Venda em Assis SP | BARRIOS Imobiliária',
    descricao: 'Encontre casas à venda em Assis SP. Confira as melhores opções com fotos, preços e detalhes na BARRIOS Imobiliária.',
    h1: 'Casas à Venda em Assis SP',
    tipoImovel: 'CASA',
    status: 'VENDA',
    cidade: 'Assis'
  },
  'casas-aluguel-assis': {
    titulo: 'Casas para Alugar em Assis SP | BARRIOS Imobiliária',
    descricao: 'Casas para alugar em Assis SP. Veja fotos, preços e entre em contato com a BARRIOS Imobiliária.',
    h1: 'Casas para Alugar em Assis SP',
    tipoImovel: 'CASA',
    status: 'ALUGUEL',
    cidade: 'Assis'
  },
  'apartamentos-venda-assis': {
    titulo: 'Apartamentos à Venda em Assis SP | BARRIOS Imobiliária',
    descricao: 'Apartamentos à venda em Assis SP. Encontre o imóvel ideal com a BARRIOS Imobiliária.',
    h1: 'Apartamentos à Venda em Assis SP',
    tipoImovel: 'APARTAMENTO',
    status: 'VENDA',
    cidade: 'Assis'
  },
  'apartamentos-aluguel-assis': {
    titulo: 'Apartamentos para Alugar em Assis SP | BARRIOS Imobiliária',
    descricao: 'Apartamentos para alugar em Assis SP. Confira as opções disponíveis na BARRIOS Imobiliária.',
    h1: 'Apartamentos para Alugar em Assis SP',
    tipoImovel: 'APARTAMENTO',
    status: 'ALUGUEL',
    cidade: 'Assis'
  },
  'terrenos-venda-assis': {
    titulo: 'Terrenos à Venda em Assis SP | BARRIOS Imobiliária',
    descricao: 'Terrenos à venda em Assis SP. As melhores opções para construir com a BARRIOS Imobiliária.',
    h1: 'Terrenos à Venda em Assis SP',
    tipoImovel: 'TERRENO',
    status: 'VENDA',
    cidade: 'Assis'
  },
  'imoveis-venda-assis': {
    titulo: 'Imóveis à Venda em Assis SP | BARRIOS Imobiliária',
    descricao: 'Imóveis à venda em Assis SP. Casas, apartamentos e terrenos com a BARRIOS Imobiliária.',
    h1: 'Imóveis à Venda em Assis SP',
    status: 'VENDA',
    cidade: 'Assis'
  },
  'imoveis-aluguel-assis': {
    titulo: 'Imóveis para Alugar em Assis SP | BARRIOS Imobiliária',
    descricao: 'Imóveis para alugar em Assis SP. Encontre casas e apartamentos para locação na BARRIOS Imobiliária.',
    h1: 'Imóveis para Alugar em Assis SP',
    status: 'ALUGUEL',
    cidade: 'Assis'
  },
};

@Component({
  selector: 'app-property-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-category.component.html',
  styleUrl: './property-category.component.css'
})
export class PropertyCategoryComponent implements OnInit {
  properties: Property[] = [];
  isLoading = true;
  config: typeof SLUG_CONFIG[string] | null = null;
  totalElements = 0;
  currentPage = 0;
  totalPages = 0;

  apiUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) window.scrollTo(0, 0);

    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.config = SLUG_CONFIG[slug];

    if (!this.config) {
      this.router.navigate(['/']);
      return;
    }

    this.setMetaTags(this.config);
    this.loadProperties();
  }

  loadProperties(page = 0) {
    this.isLoading = true;
    this.currentPage = page;

    const filtros: Record<string, any> = {};
    if (this.config?.tipoImovel) filtros['tipoImovel'] = this.config.tipoImovel;
    if (this.config?.status) filtros['status'] = this.config.status;

    this.propertyService.buscar(filtros, page, 12).subscribe({
      next: (res) => {
        this.properties = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private setMetaTags(c: typeof SLUG_CONFIG[string]) {
    this.title.setTitle(c.titulo);
    this.meta.updateTag({ name: 'description', content: c.descricao });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: c.titulo });
    this.meta.updateTag({ property: 'og:description', content: c.descricao });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  getImageUrl(fileName: string): string {
    if (!fileName) return '';
    return `${this.apiUrl}/uploads/thumb_${fileName}`;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onPageChange(page: number) {
    this.loadProperties(page);
  }
}
