export class User {
    id: number;
    nom: string;
    nom_utilisateur: string;
    email: string;
    mot_de_passe: string;
  
    constructor(id: number, nom: string, nom_utilisateur: string, email: string, mot_de_passe: string) {
      this.id = id;
      this.nom = nom;
      this.nom_utilisateur = nom_utilisateur;
      this.email = email;
      this.mot_de_passe = mot_de_passe;
    }
}    
