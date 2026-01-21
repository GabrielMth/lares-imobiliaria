// LoginRequestDTO
export interface LoginRequest {
  username: string; 
  password: string; 
}

// LoginResponseDTO
export interface LoginResponse {
  accessToken: string; 
  expiresIn: number;
  tokenType: string;
  username: string;
  name: string; 
}

// UsuarioRequestDTO
export interface UsuarioRequest {
  nome: string;
  username: string; 
  email: string;
  password: string;
  role?: string; 
}

// UsuarioResponseDTO
export interface UsuarioResponse {
  userId: number;
  nome: string;
  username: string;
  email: string;
  role: string;
}