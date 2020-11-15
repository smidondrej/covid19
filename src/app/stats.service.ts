import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from '@angular/fire/firestore';
import { Country } from './country.module';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private country: Country;
  private summary: any = [];

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  public async getCountry(countryName: String) {
    if(this.country == null || this.country.name == countryName) {
      await this.fetchCountry(countryName);
    }
    return this.country;
  }

  async fetchCountry(countryName: String) {
    try {
      this.firestore.collection["countries"].doc(countryName).get().subscribe((doc) => {
        this.summary = doc;
      });
    } catch(TypeError) {
      console.log("no data in storage - I am fetching it");
      await this.getSummary();
      if(countryName == 'Worldwide') {
        // global stats
        let country: Country = new Country(
          'Worldwide',
          this.summary["Global"]["NewConfirmed"],
          this.summary["Global"]["TotalConfirmed"],
          this.summary["Global"]["NewDeaths"],
          this.summary["Global"]["TotalDeaths"],
          this.summary["Global"]["NewRecovered"],
          this.summary["Global"]["TotalRecovered"],
          new Date()
        );
        this.country = country;
        // TODO: store data in firestore
    //   } else {
    //     // countries
    //   }
    // } else {
    //   // firestore data
  
      }
    }
    
  }

  async getSummary() {
    const url = 'https://api.covid19api.com/summary';
    const promise = new Promise((resolve, reject) => {
      // url has to be a const
      this.http.get(url).toPromise().then(
        (res: any) => {
          //Success
          this.summary = res;
          resolve();
        },
          err => {
            reject(err);
          }
        );
    });
    return promise;
  }
}
