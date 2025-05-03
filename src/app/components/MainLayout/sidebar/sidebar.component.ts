import { Component, HostListener } from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isSearchOpen = false;
  searchQuery: string = "";
  historyItems: any[] = [];


  constructor(private sharedService: SharedService, private chatService: ChatService) { }


  ngOnInit() {
    this.loadChatSessions();

  }
  loadChatSessions() {
    this.chatService.getChatSessions().subscribe({
      next: (sessions) => {
        const savedChatId = Number(localStorage.getItem('chatId'));

        this.historyItems = sessions.map(session => ({
          title: session.title,
          showDropdown: false,
          isActive: session.id === savedChatId,
          chatId: session.id
        }));
      },
      error: (err) => {
        console.error("Erreur lors du chargement des sessions :", err);
      }
    });
  }
  afficheChat(chatId: number) {
    const selectedItem = this.historyItems.find(item => item.chatId === chatId);
    this.setActiveChat(selectedItem);

    console.log('Chat ID:', chatId);

    if (chatId !== undefined && chatId !== null) {
      this.sharedService.setChatId(chatId);
      this.isSearchOpen = false
      // 🔥 Ajouter cette ligne :
      localStorage.setItem('chatId', chatId.toString());
    } else {
      console.error('Chat ID is undefined');
    }
  }

  setActiveChat(selectedItem: any) {
    this.historyItems.forEach(item => item.isActive = false);
    selectedItem.isActive = true;
  }
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    this.searchQuery = "";
  }
  filteredHistory() {
    return this.historyItems.filter(chat =>
      chat.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  toggleDropdown(item: any) {
    this.historyItems.forEach((i) => {
      if (i !== item) {
        i.showDropdown = false;
        i.isActive = false;
      }
    });

    item.showDropdown = !item.showDropdown;
    item.isActive = item.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeMenusOnClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;

    // Ferme seulement les dropdowns, ne touche pas à isActive ici
    if (!targetElement.closest('.options-menu') && !targetElement.closest('.dropdown')) {
      this.historyItems.forEach(item => item.showDropdown = false);
    }

    if (!targetElement.closest('.search-container') && !targetElement.closest('.search')) {
      this.isSearchOpen = false;
    }
  }
  newChat() {
    this.sharedService.startNewChat();
  }
  enableEdit(item: any) {
    item.isEditing = true;
    item.newTitle = item.title;
  }
  updateTitle(item: any) {
    if (item.newTitle && item.newTitle !== item.title) {
      // Appeler l'API pour mettre à jour le titre dans la base de données
      this.chatService.updateTitleSession(item.chatId, item.newTitle).subscribe({
        next: (response) => {
          item.title = item.newTitle;  // Mettre à jour le titre localement
          item.isEditing = false;      // Désactiver le mode édition
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour du titre :", err);
          alert("Une erreur est survenue lors de la mise à jour du titre.");
          item.isEditing = false;  // Désactiver le mode édition même en cas d'erreur
        }
      });
    } else {
      item.isEditing = false;  // Désactiver l'édition si le titre n'a pas changé
    }
  }
  confirmDelete(item: any, event: Event) {
    event.stopPropagation(); // Empêche le clic de déclencher l'affichage du chat
    console.log(item.chatId)
    const confirmed = confirm(`Voulez-vous vraiment supprimer la session "${item.title}" ?`);
    if (confirmed) {
      console.log('ID de la session à supprimer:', item.chatId);  // Vérifie l'ID de la session
      this.chatService.deleteSession(item.chatId).subscribe({
        next: (res) => {
          this.historyItems = this.historyItems.filter(h => h.chatId !== item.chatId);
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression de la session.');
        }
      });
    }
  }



}
