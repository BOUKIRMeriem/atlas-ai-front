import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private http: HttpClient) { }

  createNewChat(firstMessage: string): Observable<any> {
    return this.http.post('http://localhost:5000/chat/new_chat', { first_message: firstMessage });
  }

  sendMessage(message: string, chatId: number): Observable<any> {
    return this.http.post<any>('http://localhost:5000/chat/', { message, chat_id: chatId });
  }

  getChatSessions() {
    return this.http.get<any[]>('http://localhost:5000/history/');
  }

  getMessages(chatId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5000/chat/${chatId}`);
  }

  deleteSession(sessionId: number) {
    console.log('Suppression de la session avec ID:', sessionId);  // Vérifie l'ID
    return this.http.delete<any>(`http://localhost:5000/history/delete/${sessionId}`);
  }
  updateTitleSession(sessionId: number , newTitle: string) {
    return this.http.put<any>(`http://localhost:5000/history/update/${sessionId}`, { title: newTitle });
  }
  
  

}
