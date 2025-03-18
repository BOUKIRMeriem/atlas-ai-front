import { Component } from '@angular/core';
import { 
  faCommentDots, 
  faMagnifyingGlass, 
  faPaperclip,       // ✅ Ajouté
  faMicrophone,      // ✅ Ajouté
  faUserCircle 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-interface-principale',
  templateUrl: './interface-principale.component.html',
  styleUrls: ['./interface-principale.component.scss']
})
export class InterfacePrincipaleComponent {
  message: string = '';
  messages: { sender: string, text: string, timestamp: Date }[] = [];

  // Icônes FontAwesome
  faCommentDots = faCommentDots;
  faSearch = faMagnifyingGlass;
  faPaperclip = faPaperclip;   // ✅ Correction ici
  faMicrophone = faMicrophone; // ✅ Correction ici
  faUserCircle = faUserCircle;

  sendMessage() {
    if (!this.message.trim()) return;

    this.messages.push({ sender: 'user', text: this.message, timestamp: new Date() });

    setTimeout(() => {
      this.messages.push({ sender: 'bot', text: 'Réponse automatique du bot.', timestamp: new Date() });
    }, 1000);

    this.message = '';
  }
}
