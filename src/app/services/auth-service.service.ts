import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, UsuarioRequest, UsuarioResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Ajuste a porta se necessário
  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(dados: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, dados).pipe(
      tap(response => {
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('user_name', response.name);
        }
      })
    );
  }

  cadastrar(dados: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.API_URL}/usuarios`, dados);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}