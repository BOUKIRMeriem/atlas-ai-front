import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service'; 
import { Router } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginError: string | null = null;
  successMessage: string | null = null; 
  showPassword: boolean = false;

  loginForm: FormGroup = this.fb.group({
    identifiant: ['', [Validators.required]], // Email ou nom d'utilisateur
    mot_de_passe: ['', [Validators.required]] 
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private auth: Auth,private toastr: ToastrService) { }

  login(): void {
    const { identifiant, mot_de_passe } = this.loginForm.value;
  
    // Vérification simple du format de l'email avec regex
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifiant);
  
    const loginObservable = isEmail
      ? this.authService.loginWithEmail(identifiant, mot_de_passe) // Connexion par email
      : this.authService.loginWithUsername(identifiant, mot_de_passe); // Connexion par nom d'utilisateur
  
    loginObservable.subscribe({
      next: (res) => {
        console.log("Connecté", res);
        this.loginError = "";
        this.successMessage = "Login réussie !";
        setTimeout(() => {
          this.router.navigate(['/chat']); 
        }, 1000);
      },
      error: (err) => {
        console.error("Erreur de login", err);
        if (err.message === 'Veuillez vérifier votre email avant de vous connecter.') {
          this.loginError = err.message; 
        } else {
          this.loginError = "Identifiant ou mot de passe incorrect.";
        }
      }
    });
  }
  
  handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        this.successMessage = `Bienvenue ${result.user.displayName}`;
        this.loginError = null;
        this.router.navigate(['/chat']);
      })
      .catch((error) => {
        console.error(error);
        this.loginError = "Échec de la connexion avec Google.";
        this.successMessage = null;
      });
  }
  
  onForgotPassword() {
    const email = this.loginForm.get('identifiant')?.value;
    console.log("Email saisi :", email);
  
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !isEmail) {
      this.toastr.error("Veuillez entrer une adresse email valide.");
      this.loginError = "Veuillez entrer une adresse email valide.";
      return;
    }
  
    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.toastr.success("Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.");
        this.successMessage = "Le lien de réinitialisation a été envoyé à votre adresse email.";
      },
      error: (err) => {
        console.error("Erreur lors de la réinitialisation :", err);
        this.toastr.error("Erreur lors de l'envoi de l'email : " + err.message);
        this.loginError = "Une erreur est survenue lors de la demande de réinitialisation.";
      }
    });
  }
  
  
  
  
  
  
}
