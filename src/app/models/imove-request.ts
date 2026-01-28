// imovel-request.dto.ts
export type TipoImovel =
  | 'CASA'
  | 'APARTAMENTO'
  | 'TERRENO'
  | 'CHACARA'
  | 'BARRACAO'
  | 'SITIO';

export type Status = 'VENDA' | 'ALUGUEL';

export interface EnderecosRequestDtos {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface ImovelRequestDto {
  titulo: string;
  descricao: string;
  tipoImovel: TipoImovel;
  status: Status;
  valor: number;
  areaTotal?: number;
  areaConstruida?: number;
  quartos?: number;
  banheiros?: number;
  vagasGaragem?: number;
  enderecos: EnderecosRequestDtos;
  movelActive: boolean;
}
