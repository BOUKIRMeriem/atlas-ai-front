import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: Auth) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return next.handle(req); 
    }

    return from(user.getIdToken()).pipe(
      switchMap(token => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }),
      catchError(error => {
        console.error("Erreur d'interception", error);
        return next.handle(req); 
      })
    );
  }

}
