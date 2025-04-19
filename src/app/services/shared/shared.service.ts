import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private hasScrollSubject = new BehaviorSubject<boolean>(false);
  hasScroll$ = this.hasScrollSubject.asObservable();
  setHasScroll(value: boolean) {
    this.hasScrollSubject.next(value);
  }

  private newChatSubject = new Subject<void>();
  newChat$ = this.newChatSubject.asObservable();
  startNewChat() {
    this.newChatSubject.next(); 
  }
}
