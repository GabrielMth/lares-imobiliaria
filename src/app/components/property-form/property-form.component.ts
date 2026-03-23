import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Property } from '../../models/property.model';
import {
  ImovelRequestDto,
  Status,
} from '../../models/imove-request';
import { CepService } from '../../services/viacep.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.css',
})
export class PropertyFormComponent implements OnInit {
  @Input() property: Property | null = null;
  @Output() propertySaved = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  mainPhotoIndex = 0;

  maxFotos = 24;
  maxSizeMb = 100;
  photoError = '';

  formData: any = {
    type: 'casa',
    transactionType: 'venda',
    title: '',
    price: '',
    area: '',
    areaConstruida: '',
    bedrooms: '',
    suites: '',
    bathrooms: '',
    parking: '',

    // endereço
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    isComercial: false,

    description: '',
  };

  constructor(
    private adminService: AdminService,
    private cepService: CepService,
  ) { }

  ngOnInit() { }

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.photoError = '';

    const incoming = Array.from(input.files);

    // valida tipo e tamanho original
    const maxBytes = this.maxSizeMb * 1024 * 1024;

    const valid = incoming.filter((f) => {
      const isImage = f.type.startsWith('image/');
      const okSize = f.size <= maxBytes;
      return isImage && okSize;
    });

    const rejected = incoming.length - valid.length;
    if (rejected > 0) {
      this.photoError = `Alguns arquivos foram ignorados (apenas imagens até ${this.maxSizeMb}MB).`;
    }

    // 🔽 COMPRESSÃO (aqui é o pulo do gato)
    const compressed: File[] = [];
    for (const f of valid) {
      try {
        const c = await this.compressImage(
          f,
          1600,
          0.60,
          'image/jpeg' // ← muda de 'image/webp' para 'image/jpeg'
        );
        compressed.push(c);
      } catch {
        compressed.push(f); // fallback se algo der errado
      }
    }

    // junta, limita quantidade
    const combined = [...this.selectedFiles, ...compressed].slice(0, this.maxFotos);

    if (
      combined.length === this.maxFotos &&
      this.selectedFiles.length + compressed.length > this.maxFotos
    ) {
      this.photoError = `Limite de ${this.maxFotos} fotos atingido.`;
    }

    this.selectedFiles = combined;

    // recria previews (libera URLs antigas)
    this.previewUrls.forEach((u) => URL.revokeObjectURL(u));
    this.previewUrls = this.selectedFiles.map((f) => URL.createObjectURL(f));

    // garante foto principal válida
    if (this.mainPhotoIndex >= this.selectedFiles.length) {
      this.mainPhotoIndex = 0;
    }

    input.value = '';
  }


  private mapTipoImovel(type: string) {
    const map: any = {
      casa: 'CASA',
      apartamento: 'APARTAMENTO',
      terreno: 'TERRENO',
      chacara: 'CHACARA',
      barracao: 'BARRACAO',
      sitio: 'SITIO',
      sobrado: 'SOBRADO',
    };
    return map[type];
  }

  private mapStatus(v: string): Status {
    return v === 'aluguel' ? 'ALUGUEL' : 'VENDA';
  }

  onSubmit() {
    const fotosOrdenadas = [...this.selectedFiles];
    if (fotosOrdenadas.length > 0) {
      const principal = fotosOrdenadas.splice(this.mainPhotoIndex, 1)[0];
      fotosOrdenadas.unshift(principal);
    }

    const imovel: ImovelRequestDto = {
      titulo: this.formData.title,
      descricao: this.formData.description,
      tipoImovel: this.mapTipoImovel(this.formData.type),
      status: this.mapStatus(this.formData.transactionType),
      valor: Number(this.formData.price),
      areaTotal: Number(this.formData.area),
      areaConstruida: this.formData.areaConstruida !== '' ? Number(this.formData.areaConstruida) : undefined,
      suites: this.formData.suites !== '' ? Number(this.formData.suites) : 0,
      quartos: Number(this.formData.bedrooms),
      banheiros: Number(this.formData.bathrooms),
      vagasGaragem: Number(this.formData.parking),
      enderecos: {
        cep: this.formData.cep,
        logradouro: this.formData.logradouro,
        numero: this.formData.numero,
        bairro: this.formData.bairro,
        cidade: this.formData.cidade,
        estado: this.formData.estado,
      },
      movelActive: true,
      isComercial: !!this.formData.isComercial,
    };

    this.adminService.criarImovel(imovel, fotosOrdenadas).subscribe({
      next: () => {
        this.propertySaved.emit();
        this.clearPhotos();
      },
      error: (err) => {
        console.error('Erro ao criar imóvel', err);
      },
    });
  }

  cancel() {
    this.formCancelled.emit();
  }

  updateImageArray(index: number, value: string) {
    this.formData.images[index] = value;
  }

  setMainPhoto(index: number) {
    this.mainPhotoIndex = index;
  }

  removePhoto(index: number) {
    // libera URL
    URL.revokeObjectURL(this.previewUrls[index]);

    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);

    if (this.selectedFiles.length === 0) {
      this.mainPhotoIndex = 0;
      return;
    }

    if (this.mainPhotoIndex === index) {
      this.mainPhotoIndex = 0;
    } else if (this.mainPhotoIndex > index) {
      this.mainPhotoIndex--;
    }
  }

  clearPhotos() {
    this.previewUrls.forEach((u) => URL.revokeObjectURL(u));
    this.selectedFiles = [];
    this.previewUrls = [];
    this.mainPhotoIndex = 0;
    this.photoError = '';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let v = bytes;
    while (v >= 1024 && i < units.length - 1) {
      v = v / 1024;
      i++;
    }
    return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  }

  private cepCarregadoPara = ''; // evita chamar várias vezes o mesmo CEP
  cepLoading = false; // opcional (pra UI)
  cepError = ''; // opcional (pra UI)

  onCepInput() {
    this.cepError = '';

    // mantém só números
    const digits = (this.formData.cep || '').replace(/\D/g, '').slice(0, 8);

    // aplica máscara 00000-000
    this.formData.cep =
      digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;

    // se completou 8 dígitos, busca automaticamente (uma vez)
    if (digits.length === 8 && this.cepCarregadoPara !== digits) {
      this.buscarCep(digits);
    } else if (digits.length < 8) {
      // se apagou CEP, você pode escolher limpar os campos:
      // this.limparEnderecoAuto();
      this.cepCarregadoPara = '';
    }
  }

  buscarCepSeCompleto() {
    const digits = (this.formData.cep || '').replace(/\D/g, '');
    if (digits.length === 8 && this.cepCarregadoPara !== digits) {
      this.buscarCep(digits);
    }
  }

  private buscarCep(cep: string) {
    this.cepLoading = true;
    this.cepError = '';

    this.cepService.buscar(cep).subscribe({
      next: (res) => {
        this.cepLoading = false;

        if (res.erro) {
          this.cepError = 'CEP não encontrado.';
          this.cepCarregadoPara = '';
          this.limparEnderecoAuto();
          return;
        }

        // preenche os campos do DTO
        this.formData.logradouro = res.logradouro ?? '';
        this.formData.bairro = res.bairro ?? '';
        this.formData.cidade = res.localidade ?? '';
        this.formData.estado = res.uf ?? '';

        this.cepCarregadoPara = cep;
      },
      error: () => {
        this.cepLoading = false;
        this.cepError = 'Erro ao consultar CEP. Tente novamente.';
        this.cepCarregadoPara = '';
      },
    });
  }

  private limparEnderecoAuto() {
    this.formData.logradouro = '';
    this.formData.bairro = '';
    this.formData.cidade = '';
    this.formData.estado = '';
  }



  private async compressImage(
    file: File,
    maxSide = 1600,
    quality = 0.75,
    mime: 'image/webp' | 'image/jpeg' = 'image/jpeg' // ← muda default para jpeg
  ): Promise<File> {
    // Se já for pequeno, não mexe (opcional)
    const maxBytesNoCompress = 900 * 1024; // 900KB
    if (file.size <= maxBytesNoCompress) return file;

    const dataUrl = await this.readAsDataURL(file);
    const img = await this.loadImage(dataUrl);

    const { width, height } = this.calcNewSize(img.width, img.height, maxSide);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob(
        (b) => resolve(b ?? file),
        mime,
        quality
      );
    });

    const ext = mime === 'image/webp' ? 'webp' : 'jpg';
    const newName = file.name.replace(/\.\w+$/, `.${ext}`);

    return new File([blob], newName, { type: mime, lastModified: Date.now() });
  }

  private readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private calcNewSize(w: number, h: number, maxSide: number) {
    if (w <= maxSide && h <= maxSide) return { width: w, height: h };

    const ratio = w / h;
    if (w >= h) {
      return { width: maxSide, height: Math.round(maxSide / ratio) };
    }
    return { width: Math.round(maxSide * ratio), height: maxSide };
  }

}
