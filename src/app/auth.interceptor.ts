import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './service/auth/auth.service';  
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isRefreshRequest = req.url.includes('/refresh');
    const token = isRefreshRequest
      ? localStorage.getItem('refresh_token')
      : localStorage.getItem('access_token');

    let clonedReq = req;
    if (token) {
      clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(clonedReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          const erreur = error.error?.erreur;

          // 🌟 Token expiré → on tente de rafraîchir
          if (error.status === 401 && erreur === 'token_expiré' && !isRefreshRequest) {
            return this.handle401Error(clonedReq, next);
          }

          // 🔒 Cas critiques → logout direct
          if (
            (error.status === 401 && (erreur === 'token_révoqué' || erreur === "header_d'autorisation")) ||
            (error.status === 422 && erreur === 'token_invalide')
          ) {
            this.authService.clearTokens();
            this.router.navigate(['/login']);
          }
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          const newAccessToken = res.access_token;
          localStorage.setItem('access_token', newAccessToken);
          this.refreshTokenSubject.next(newAccessToken);

          const cloned = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${newAccessToken}`)
          });
          return next.handle(cloned);
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.clearTokens();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          const cloned = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(cloned);
        })
      );
    }
  }
}
