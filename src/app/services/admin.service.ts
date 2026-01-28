// admin.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImovelRequestDto } from '../models/imove-request';
import { environment } from '../../environments/enviroment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/imoveis`;

  constructor(private http: HttpClient) {}

  criarImovel(imovel: ImovelRequestDto, fotos: File[]) {
    const formData = new FormData();

    const imovelBlob = new Blob([JSON.stringify(imovel)], {
      type: 'application/json',
    });


    formData.append('imovel', imovelBlob);

    fotos.forEach((foto) => formData.append('fotos', foto, foto.name));

    return this.http.post(`${this.baseUrl}/criarImovel`, formData);
  }
  
}
