import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoResize]'
})
export class AutoResizeDirective {

  private readonly maxHeight = 300; // Hauteur max en pixels 

  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    const textarea = this.el.nativeElement;
    textarea.style.height = 'auto'; // Réinitialiser la hauteur
    const newHeight = textarea.scrollHeight;

    // Vérifier si la hauteur dépasse la limite
    if (newHeight > this.maxHeight) {
      textarea.style.height = this.maxHeight + 'px';
      textarea.style.overflowY = 'auto'; // Activer le défilement si nécessaire
    } else {
      textarea.style.height = newHeight + 'px';
      textarea.style.overflowY = 'hidden'; // Masquer le défilement si pas nécessaire
    }
  }

}
