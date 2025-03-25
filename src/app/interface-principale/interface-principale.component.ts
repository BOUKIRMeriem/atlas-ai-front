import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-interface-principale',
  templateUrl: './interface-principale.component.html',
  styleUrls: ['./interface-principale.component.scss']
})
export class InterfacePrincipaleComponent implements AfterViewInit {
  isTextNotEmpty = false;
  menuOpen = false;
  isSidebarHidden = false;
  message: string = "";
  messages: { text: string; isUser: boolean }[] = [];
  isFirstMessageSent = false;
  hasScroll = false; // Ajout de la variable pour détecter le scroll

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.checkScroll(); // Vérifie le scroll au chargement
  }

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

  sendMessage(event: Event) {
    event.preventDefault(); // Empêche le saut de ligne dans le textarea

    this.message = this.message.trim(); // Supprime les espaces avant et après

    if (this.message.length === 0) {
      return;
    }

    this.messages.push({ text: this.message, isUser: true });

    if (!this.isFirstMessageSent) {
      this.isFirstMessageSent = true;
    }

    setTimeout(() => {
      this.messages.push({ text: "Hey! How's it going?", isUser: false });
      this.scrollToBottom();
    }, 1000);

    this.message = ""; // Réinitialiser l'input
    this.isTextNotEmpty = false;
    this.scrollToBottom();
  }


  scrollToBottom() {
    if (this.messagesContainer) {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
        this.checkScroll(); // Vérifie le scroll après chaque ajout de message
      }, 0);
    }
  }

  checkScroll() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      this.hasScroll = element.scrollHeight > element.clientHeight;
    }
  }
}
