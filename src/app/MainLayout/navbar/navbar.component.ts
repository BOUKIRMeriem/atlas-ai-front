import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { SharedService } from '../../service/shared/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  hasScroll = false;
  userName: string | null = null;
  name: string | null = null;
  userEmail: string | null = null;
  newPassword: string = '';
  showChangePasswordModal = false;
  oldPassword: string = '';
  confirmPassword: string = '';
  showSettingsModal = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private authService: AuthService, private sharedService: SharedService) { }
  ngOnInit() {
    this.sharedService.hasScroll$.subscribe(value => {
      this.hasScroll = value;
    });
    this.authService.getConnectedUserInfo().subscribe((userData) => {
      if (userData) {
        this.name = userData.nom;
        this.userEmail = userData.email;
        this.userName = userData.nom_utilisateur;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  logout() {
    this.authService.logoutAndRedirect();
  }
  @HostListener('document:click', ['$event'])
  closeMenusOnClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    // Vérifie si le clic est en dehors des menus
    if (!targetElement.closest('.avatar-container')) {
      this.menuOpen = false;
    }
  }

  openSettings() {
    this.showSettingsModal = true;
  }

  closeSettingsModal() {
    this.showSettingsModal = false;
  }

  changerMotDePasse() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    if (this.newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    this.authService.reauthAndUpdatePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        alert('Mot de passe modifié avec succès.');
        this.closeChangePasswordModal();
        this.clearPasswordFields();
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors du changement de mot de passe.");
      }
    });
  }

  openChangePasswordModal() {
    this.showSettingsModal = false;
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  clearPasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

}
