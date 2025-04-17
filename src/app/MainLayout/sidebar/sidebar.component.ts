import { Component, HostListener ,Input} from '@angular/core';
import { SharedService } from '../../service/shared/shared.service'; 

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isSearchOpen = false;
  searchQuery: string = "";
    constructor(private sharedService: SharedService) {}

  historyItems = [
    { title: 'Analyse des ventes', showDropdown: false, isActive: false },
    { title: 'Analyse des Retours', showDropdown: false, isActive: false },
    { title: 'Prédiction des Tendances', showDropdown: false, isActive: false },
    { title: 'Prévisions de ventes', showDropdown: false, isActive: false },
    { title: 'Analyse des ventes', showDropdown: false, isActive: false },
    { title: 'Analyse des Retours', showDropdown: false, isActive: false },
    { title: 'Prédiction des Tendances', showDropdown: false, isActive: false },
    { title: 'Prévisions de ventes', showDropdown: false, isActive: false },
    { title: 'Analyse des ventes', showDropdown: false, isActive: false },
    { title: 'Analyse des Retours', showDropdown: false, isActive: false },
    { title: 'Prédiction des Tendances', showDropdown: false, isActive: false },
    { title: 'Prévisions de ventes', showDropdown: false, isActive: false }
  ];

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    this.searchQuery = "";
  }
  filteredHistory() {
    return this.historyItems.filter(chat =>
      chat.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  toggleDropdown(item: any, event: Event) {
    this.historyItems.forEach((i) => {
      if (i !== item) {
        i.showDropdown = false; // Ferme les autres menus
        i.isActive = false;
      }
    });
    item.showDropdown = !item.showDropdown;
    item.isActive = item.showDropdown;
  }
  @HostListener('document:click', ['$event'])
  closeMenusOnClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    // Vérifie si le clic est en dehors des menus
    if (!targetElement.closest('.options-menu')) {
      this.historyItems.forEach((item) => (item.showDropdown = false, item.isActive = false));
    }
    if (!targetElement.closest('.search-container') && !targetElement.closest('.search')) {
      this.isSearchOpen = false;
    }
  }
  newChat() {
    this.sharedService.startNewChat(); 
  }


 
 
 

}
