// admin.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImovelRequestDto } from '../models/imove-request';
import { environment } from '../../environments/enviroment';
import { Observable, map } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/imoveis`;

  constructor(private http: HttpClient) { }

  criarImovel(imovel: ImovelRequestDto, fotos: File[]) {
    const formData = new FormData();

    const imovelBlob = new Blob([JSON.stringify(imovel)], {
      type: 'application/json',
    });

    formData.append('imovel', imovelBlob);

    fotos.forEach((foto) => formData.append('fotos', foto, foto.name));

    return this.http.post(`${this.baseUrl}/criarImovel`, formData);
  }

  getAllProperties(): Observable<Property[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.content)
    );
  }

  deleteImovel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, ativo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status?ativo=${ativo}`, {});
  }

  buscarTabela(
    filters: any,
    page: number,
    size: number
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (filters.nome) {
      params = params.set('nome', filters.nome);
    }

    if (filters.tipoImovel) {
      params = params.set('tipoImovel', filters.tipoImovel);
    }

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<any>(`${this.baseUrl}/tabela`, { params });

  }

  getTotals(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/totais`);
  }




}
