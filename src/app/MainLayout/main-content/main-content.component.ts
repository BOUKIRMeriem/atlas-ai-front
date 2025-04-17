import { Component, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../../service/shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  message: string = "";
  messages: { text: string; isUser: boolean }[] = [];
  isFirstMessageSent = false;
  isTextNotEmpty = false;
   constructor(private sharedService: SharedService) { }
   ngOnInit() {
     this.sharedService.newChat$.subscribe(() => {
       this.resetChat();
     });
   }
   ngAfterViewInit() {
    this.checkScroll();
  }
   resetChat() {
     this.messages = [];
     this.message = '';
     this.isFirstMessageSent = false;
     this.isTextNotEmpty = false;
     this.sharedService.setHasScroll(false);
   }
  toggleIcons(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.isTextNotEmpty = textarea.value.trim().length > 0;
  }
  scrollToBottom() {
    if (this.messagesContainer) {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        this.checkScroll(); 
      }, 0);
    }
  }
  checkScroll() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      const hasScroll = element.scrollHeight > element.clientHeight;
      this.sharedService.setHasScroll(hasScroll);
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

}
