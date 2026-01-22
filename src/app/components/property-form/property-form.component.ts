import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-form.component.html',
  styleUrl: './property-form.component.css'
})
export class PropertyFormComponent implements OnInit {
  @Input() property: Property | null = null;
  @Output() propertySaved = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  formData: any = {
    type: 'casa',
    transactionType: 'venda',
    title: '',
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    address: '',
    city: '',
    description: '',
    mainImage: '',
    images: ['', '', '', ''],
    featured: false
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    if (this.property) {
      this.formData = { ...this.property };
      // Garantir que images tenha 4 posições
      while (this.formData.images.length < 4) {
        this.formData.images.push('');
      }
    }
  }

  onSubmit() {
    // Filtrar imagens vazias
    const images = this.formData.images.filter((img: string) => img.trim() !== '');

    const propertyData: Property = {
      ...this.formData,
      images: images.length > 0 ? images : [this.formData.mainImage],
      mainImage: this.formData.mainImage || images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
    };

    if (this.property) {
      // Editar

    } else {
      // Adicionar

    }

    this.propertySaved.emit();
  }

  cancel() {
    this.formCancelled.emit();
  }

  updateImageArray(index: number, value: string) {
    this.formData.images[index] = value;
  }
}
