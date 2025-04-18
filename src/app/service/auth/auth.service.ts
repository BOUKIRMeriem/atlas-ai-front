import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {Auth,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,signOut,GoogleAuthProvider,signInWithPopup} from '@angular/fire/auth';
import {Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { User as FirebaseUser, updatePassword } from 'firebase/auth';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth';
  private firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient, private router: Router, private auth: Auth) {}

  register(email: string, password: string, nom: string, nom_utilisateur: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
  
        // 1. Envoi de l'email de vérification
        await sendEmailVerification(user);
  
        // 2. Ajout dans Firestore
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, {
          nom: nom,
          nom_utilisateur: nom_utilisateur,
          email: email,
        });
  
        const usernameRef = doc(this.firestore, `usernames/${nom_utilisateur}`);
        await setDoc(usernameRef, {
          email: email,
        });
  
        return userCredential;
      })
    );
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  loginWithUsername(username: string, password: string): Observable<any> {
    const usernamesDoc = doc(this.firestore, `usernames/${username}`);

    return from(getDoc(usernamesDoc)).pipe(
      switchMap((docSnap) => {
        if (docSnap.exists()) {
          const email = docSnap.data()['email'];
          console.log('Email trouvé:', email);
          return from(signInWithEmailAndPassword(this.auth, email, password));
        } else {
          throw new Error('Nom d’utilisateur non trouvé');
        }
      })
    );
  }

  loginWithGoogle(): Observable<any> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  logoutAndRedirect(): void {
    this.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
      },
    });
  }

  get currentUser() {
    return this.auth.currentUser;
  }
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError((error: any) => { 
        console.error("Erreur lors de l'envoi de l'email de réinitialisation : ", error);
        return of(); 
      })
    );
  }

  getConnectedUserInfo(): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) return of(null);
  
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return from(getDoc(userRef)).pipe(
      switchMap((snap) => {
        if (snap.exists()) {
          return of(snap.data());
        } else {
          return of(null);
        }
      })
    );
  }

  updatePassword(newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
  
    if (!user) {
      return of(); // ou throwError(new Error("Aucun utilisateur connecté"))
    }
  
    return from(updatePassword(user, newPassword)).pipe(
      catchError((error) => {
        console.error("Erreur lors du changement de mot de passe :", error);
        return of(); // ou throwError(error) pour remonter l'erreur
      })
    );
  }
  reauthAndUpdatePassword(currentPassword: string, newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) return of(); // ou throwError
  
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return from(
      reauthenticateWithCredential(user, credential).then(() => {
        return updatePassword(user, newPassword);
      })
    );
  }
  
  
  
}
