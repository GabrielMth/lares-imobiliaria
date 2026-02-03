import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyRequest, Page, PropertyResponse } from '../models/property.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly API_URL = `${environment.apiUrl}/imoveis`;

  constructor(private http: HttpClient) { }

  // 1. POST /imoveis/criarImovel
  createImovel(data: PropertyRequest): Observable<PropertyResponse> {
    return this.http.post<PropertyResponse>(`${this.API_URL}/criarImovel`, data);
  }

  // Passo 2: Envia as fotos (FormData)
  // Note que a URL agora espera o ID: /{id}/fotos
  uploadFotos(id: number, files: File[]): Observable<any> {
    const formData = new FormData();

    // O nome 'arquivos' DEVE ser igual ao @RequestParam("arquivos") do Java
    files.forEach(file => {
      formData.append('arquivos', file);
    });

    return this.http.post(`${this.API_URL}/${id}/fotos`, formData);
  }

  // 3. GET /imoveis (Com filtros e paginação)
  buscar(
    filtros: Record<string, any>,
    page: number = 0,
    size: number = 12
  ): Observable<Page<Property>> {

    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', 'id,desc');

    Object.entries(filtros ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<Page<Property>>(this.API_URL, { params });
  }


  // 4. GET /imoveis/{id}
  buscarPorId(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.API_URL}/${id}`);
  }
}
