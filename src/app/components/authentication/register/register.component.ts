import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerError: string | null = null;
  successMessage: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  registerForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    nom_utilisateur: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
    confirmer_mot_de_passe: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  register(): void {
    if (this.registerForm.get('mot_de_passe')?.value !== this.registerForm.get('confirmer_mot_de_passe')?.value) {
      this.registerError = 'Les mots de passe ne correspondent pas.';
      return;
    }
  
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('mot_de_passe')?.value;
    const nom = this.registerForm.get('nom')?.value;
    const nom_utilisateur = this.registerForm.get('nom_utilisateur')?.value;
  
    this.authService.register(email, password, nom, nom_utilisateur).subscribe({
      next: (res) => {
        this.successMessage = 'Inscription réussie. Un e-mail de vérification vous a été envoyé.';
        this.registerError = null;
        console.log("Inscrit avec succès", res);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.registerError = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        this.successMessage = null;
        console.error("Erreur d'inscription", err);
      }
    });
  }
  
}
