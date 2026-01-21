import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyRequest, Page, PropertyResponse } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly API_URL = 'http://localhost:8080/imoveis';

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
    filtros: {
      quartos?: number,
      vagas?: number,
      bairro?: string,
      valorMin?: number,
      valorMax?: number
    },
    page: number = 0,
    size: number = 10
  ): Observable<Page<Property>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'id,desc');

    if (filtros.quartos) params = params.set('quartos', filtros.quartos);
    if (filtros.vagas) params = params.set('vagas', filtros.vagas);
    if (filtros.bairro) params = params.set('bairro', filtros.bairro);
    if (filtros.valorMin) params = params.set('valorMin', filtros.valorMin);
    if (filtros.valorMax) params = params.set('valorMax', filtros.valorMax);

    return this.http.get<Page<Property>>(this.API_URL, { params });
  }

  // 4. GET /imoveis/{id}
  buscarPorId(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.API_URL}/${id}`);
  }
}