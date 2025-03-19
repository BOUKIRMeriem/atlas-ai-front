import { Component } from '@angular/core';



@Component({
  selector: 'app-interface-principale',
  templateUrl: './interface-principale.component.html',
  styleUrls: ['./interface-principale.component.scss']
})
export class InterfacePrincipaleComponent {
  isTextNotEmpty = false;

  toggleIcons(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.isTextNotEmpty = textarea.value.trim().length > 0;
  }
}
