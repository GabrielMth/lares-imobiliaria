import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { PropertiesListComponent } from '../../components/properties-list/properties-list.component';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { AgentSectionComponent } from '../../components/agent-section/agent-section.component';
import { CategoryLinksComponent } from '../../components/category-links/category-links.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    PropertiesListComponent,
    AboutSectionComponent,
    AgentSectionComponent,
    CategoryLinksComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
