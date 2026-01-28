import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      console.log("Preencha todos os campos!")
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          console.log("Ok logado!")

          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 800);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Usuário ou senha inválidos.';

          console.log("Error no login!")
        }
      });
  }

  
}
