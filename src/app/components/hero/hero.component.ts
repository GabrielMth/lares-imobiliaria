import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  currentImageIndex = 0;
  images = [
    'assets/images/hero-parallax.png',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1920'
  ];
  intervalId: any;
  
  ngOnInit() {
    this.startCarousel();
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }
}
