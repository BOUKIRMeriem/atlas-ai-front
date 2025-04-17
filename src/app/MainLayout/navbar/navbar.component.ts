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
  constructor(private authService: AuthService, private sharedService: SharedService) { }
  ngOnInit() {
    this.sharedService.hasScroll$.subscribe(value => {
      this.hasScroll = value;
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




}
