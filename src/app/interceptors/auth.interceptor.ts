import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const token = isBrowser ? localStorage.getItem('token') : null;

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (isBrowser && (err.status === 401 || err.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');

        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    })
  );
};
