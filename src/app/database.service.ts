import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CountryData } from './country.module';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

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
}
