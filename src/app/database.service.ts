import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CountryData } from './country.module';
import { User } from './user.module';
import { News } from './news.module';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public user: User;
  admin: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { }

  async updateCountry(country: CountryData) {
    this.firestore.collection("countries").doc(country.Slug).set({
      Slug: country.Slug,
      Country: country.Country,
      CountryCode: country.CountryCode,
      Date: country.Date,
      NewConfirmed: country.NewConfirmed,
      NewDeaths: country.NewDeaths,
      NewRecovered: country.NewRecovered,
      TotalConfirmed: country.TotalConfirmed,
      TotalDeaths: country.TotalDeaths,
      TotalRecovered: country.TotalRecovered
    }, { merge: true });
  }

  getCountry(slug: string) {
    return this.firestore.collection("countries").doc(slug).valueChanges();
  }

  getAdmin(user: User) {
    return this.firestore.collection("admins").doc(user.uid).get();
  }

  async signInWithGoogle() {
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
      uid: credentials.user.uid,
      displayName: credentials.user.displayName,
      email: credentials.user.email
    };
    this.getAdmin(this.user).subscribe((res: any) => {
      let tmp = res;
      if (tmp.get("email") == this.user.email) {
        this.admin = true;
        localStorage.setItem("admin", "true");
      } else {
        this.admin = false;
        localStorage.setItem("admin", "false");
      }
    })
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
  }

  private updateUserData() {
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    }, { merge: true });
  }

  getUser() {
    if(this.user == null && this.userSignIn()) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    return this.user;
  }

  isAdmin() {
    if(!this.admin && JSON.parse(localStorage.getItem("admin")) != null) {
      this.admin = localStorage.getItem("admin") == "true";
    }
    return this.admin;
  }

  userSignIn(): boolean {
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  signOut() {
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    localStorage.removeItem("admin");
    this.admin = false;
  }

  getNews(slug: string) {
    return this.firestore.collection("countries").doc(slug).collection("news").valueChanges();
  }

  addNews(slug: string, news: News) {
    this.firestore.collection("countries").doc(slug).collection("news").add(news);
  }
}
