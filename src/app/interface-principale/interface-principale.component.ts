import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-interface-principale',
  templateUrl: './interface-principale.component.html',
  styleUrls: ['./interface-principale.component.scss']
})
export class InterfacePrincipaleComponent {
  isTextNotEmpty = false;
  menuOpen = false;
  isSidebarHidden = false; // Garder cette ligne

  toggleIcons(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.isTextNotEmpty = textarea.value.trim().length > 0;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.avatar-container')) {
      this.menuOpen = false;
    }
  }
}
