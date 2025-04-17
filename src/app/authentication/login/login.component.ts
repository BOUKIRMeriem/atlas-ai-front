import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginError: string | null = null;
  successMessage: string | null = null; 

  loginForm: FormGroup = this.fb.group({
    identifiant: ['', [Validators.required]], // Email ou nom d'utilisateur
    mot_de_passe: ['', [Validators.required]] 
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  login(): void {
    const { identifiant, mot_de_passe } = this.loginForm.value;
    this.authService.login(identifiant, mot_de_passe).subscribe(
      (data) => {
        this.authService.saveTokens(data.access_token ,data.refresh_token);
        this.loginError =""
        this.successMessage = 'Login réussie !';
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 1000);
      },
      (error) => {
        this.loginError = 'Identifiant ou mot de passe incorrect';
      }
    );
  }
  
}
