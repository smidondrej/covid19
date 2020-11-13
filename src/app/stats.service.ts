import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private lastUpdate: Date
  private data: any = []

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getSummary(){
    const url ='https://api.covid19api.com/summary'
    this.http.get(url).subscribe((res) => {
      this.data = res;
      console.log("Data got from " + url);
    })
  }
}
