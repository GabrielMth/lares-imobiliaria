import { Injectable } from '@angular/core';
import { Property, Agent } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private agents: Agent[] = [
    {
      id: 1,
      name: 'Viviana Barros',
      role: 'Corretora de Imóveis | CRECI 12345-F',
      phone: '18997287085',
      email: 'viviana.barros@laresimobiliaria.com.br',
      photo: 'assets/images/agente-viviana.png',
      instagram: 'https://instagram.com/laresimobiliaria',
      linkedin: 'https://linkedin.com/in/viviana-barros',
      facebook: 'https://facebook.com/laresimobiliaria'
    },
    {
      id: 2,
      name: 'Carlos Eduardo Silva',
      role: 'Corretor de Imóveis | CRECI 23456-F',
      phone: '18997287086',
      email: 'carlos.silva@laresimobiliaria.com.br',
      photo: 'assets/images/agente-viviana.png',
      instagram: 'https://instagram.com/laresimobiliaria',
      linkedin: 'https://linkedin.com/in/carlos-silva',
      facebook: 'https://facebook.com/laresimobiliaria'
    },
    {
      id: 3,
      name: 'Marina Costa Santos',
      role: 'Corretora de Imóveis | CRECI 34567-F',
      phone: '18997287087',
      email: 'marina.santos@laresimobiliaria.com.br',
      photo: 'assets/images/agente-viviana.png',
      instagram: 'https://instagram.com/laresimobiliaria',
      linkedin: 'https://linkedin.com/in/marina-santos',
      facebook: 'https://facebook.com/laresimobiliaria'
    }
  ];

  constructor() {}

  getAgents(): Agent[] {
    return this.agents;
  }
  
  getAgent(): Agent {
    return this.agents[0];
  }
}
