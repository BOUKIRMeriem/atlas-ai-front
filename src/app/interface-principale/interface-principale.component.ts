import { Component } from '@angular/core';



@Component({
  selector: 'app-interface-principale',
  templateUrl: './interface-principale.component.html',
  styleUrls: ['./interface-principale.component.scss']
})
export class InterfacePrincipaleComponent {
  message: string = '';
  messages: { sender: string, text: string, timestamp: Date }[] = [];


  // Méthode pour envoyer un message
  sendMessage() {
    if (!this.message.trim()) return;

    // Ajouter le message de l'utilisateur
    this.messages.push({ sender: 'user', text: this.message, timestamp: new Date() });

    // Ajouter une réponse automatique après un délai
    setTimeout(() => {
      this.messages.push({ sender: 'bot', text: 'Réponse automatique du bot.', timestamp: new Date() });
    }, 1000);

    // Réinitialiser le champ de message
    this.message = '';
  }
}
