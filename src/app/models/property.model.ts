export type TipoImovel = 'CASA' | 'APARTAMENTO' | 'TERRENO' | 'CHACARA' | 'BARRACAO' | 'SITIO';
export type StatusImovel = 'VENDA' | 'ALUGUEL' | 'DISPONIVEL';

export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

// Equivalente ao ImovelResponseDto e ImovelDetailDto
export interface Property {
  id: number;
  titulo: string;
  descricao: string;
  valor: number;
  tipoImovel: TipoImovel;
  status: StatusImovel;

  areaTotal: number;
  areaConstruida: number;

  quartos: number;
  banheiros: number;
  vagasGaragem: number;

  endereco: Endereco;

  urlsFotos: string[];
  featured?: boolean;
}
export interface Agent {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  photo: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
}

export interface EnderecoRequest {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  complemento?: string;
}

// 2. DTO do Imóvel (Equivalente ao ImovelRequestDto do Java)
export interface PropertyRequest {
  titulo: string;
  descricao: string;

  tipoImovel: TipoImovel;
  status: StatusImovel;

  valor: number;

  areaTotal: number;
  areaConstruida: number;

  quartos: number;
  banheiros: number;
  vagasGaragem: number;

  enderecos: EnderecoRequest;

  urlsFotos?: string[];
}

// Equivalente ao ImovelResponseDto e ImovelDetailDto
export interface PropertyResponse {
  id: number;
  titulo: string;
  valor: number;

  cidade: string;
  logradouro: string;
  bairro: string;

  urlsFotos: string[];

  descricao?: string;
  quartos?: number;
  vagas?: number;
}

// Interface para tipar a paginação do Spring Boot (Page<T>)
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
