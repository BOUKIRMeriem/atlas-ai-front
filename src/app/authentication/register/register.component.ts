import { Component } from '@angular/core';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent{
  registerError: string | null = null;
  successMessage: string | null = null;

  registerForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    nom_utilisateur: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
    confirmer_mot_de_passe: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService ,private router: Router) { }

  register(): void {
    if (this.registerForm.get('mot_de_passe')?.value !== this.registerForm.get('confirmer_mot_de_passe')?.value) {
      this.registerError = 'Les mots de passe ne correspondent pas.';
      return;
    }
  
    this.authService.register(this.registerForm.value).subscribe(
      () => {
        this.successMessage = 'Inscription réussie !';
        this.registerError = "";
        this.registerForm.reset();
  
        // Redirection après 3 secondes
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        console.error('Erreur lors de l\'inscription', error);
        if (error.status === 409 && error.error?.message) {
          this.registerError = error.error.message;
        } else {
          this.registerError = "Une erreur est survenue lors de l'inscription.";
        }
        this.successMessage = null;
      }
    );
  }
  
}

