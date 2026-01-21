import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from '../../models/property.model';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-agent-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-section.component.html',
  styleUrl: './agent-section.component.css'
})
export class AgentSectionComponent implements OnInit {
  agents: Agent[] = [];
  currentAgentIndex = 0;
  
  constructor(private mockDataService: MockDataService) {}
  
  ngOnInit() {
    this.agents = this.mockDataService.getAgents();
  }
  
  nextAgent() {
    this.currentAgentIndex = (this.currentAgentIndex + 1) % this.agents.length;
  }
  
  prevAgent() {
    this.currentAgentIndex = this.currentAgentIndex === 0 
      ? this.agents.length - 1 
      : this.currentAgentIndex - 1;
  }
  
  get currentAgent(): Agent {
    return this.agents[this.currentAgentIndex];
  }
  
  sendWhatsApp() {
    const agent = this.currentAgent;
    const message = 'Olá! Gostaria de mais informações sobre imóveis.';
    const url = `https://wa.me/55${agent.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
