import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      // ✅ token inválido/expirado ou sem permissão
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');

        // evita loop se já estiver no login
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    })
  );
};
