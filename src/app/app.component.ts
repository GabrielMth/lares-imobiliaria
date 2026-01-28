import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BARRIOS Imobiliária';
  hideHeader = false;

  constructor(private router: Router) {
    // ✅ já define no carregamento inicial
    this.hideHeader = this.router.url.startsWith('/admin');

    // ✅ atualiza a cada navegação
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.hideHeader = e.urlAfterRedirects.startsWith('/admin');
      });
  }
}
