import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; 

  constructor(private http: HttpClient, private router: Router) { }
  register(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(identifiant: string, mot_de_passe: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { identifiant, mot_de_passe });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh` ,{});
  }
  
  logoutAndRedirect() {
    this.http.get(`${this.baseUrl}/logout`).subscribe({
      next: () => {
        this.clearTokens();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur de déconnexion', err);
        this.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }
  
  saveTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }


  
}
