import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
  
@Injectable({
  providedIn: 'root'
})
export class StatsService {
  
  constructor(private http: HttpClient) { }
  private url: string = "https://api.covid19api.com/summary";
  private url_history: string = "https://api.covid19api.com/world";
  public beginning: Date = new Date();
  public countryBeginning: Date;
  
  /**
   * calls covid19 API to retrieve world sumary data
   */
  getData(): Observable<any> {
    console.log("call API " + this.url)
    return this.http.get(this.url)
      .pipe((response) => response);
  }

  /**
   * calls covid19 API to retrieve world data for the beggining of the crisis
   */
  getWorldData(): Observable<any> {
    this.setBeginning(this.beginning);
    let today = new Date();
    console.log("Asking for a data from=" + this.beginning + " to=" + today);
    let url = this.url_history + "?from=" + this.beginning.toISOString() + "&to=" + today.toISOString()
    console.log("call API " + url)
    return this.http.get(url)
      .pipe((response) => response);
  }

  /**
   * calls covid19 API to retrieve world data for last seven days
   */
  get7DaysData(): Observable<any> {
    let today = new Date();
    today.setUTCHours(0,0,0,0);
    let day = new Date();
    day.setUTCDate(day.getUTCDate() - 7);
    day.setUTCHours(0,0,0,0);
    console.log("Asking for a data from=" + day + " to=" + today);
    let url = this.url_history + "?from=" + day.toISOString() + "&to=" + today.toISOString();
    console.log("call API " + url)
    return this.http.get(url)
      .pipe((response) => response);
  }

  getCData(slug: string): Observable<any> {
    let url = "https://api.covid19api.com/total/dayone/country/" + slug;
    console.log("call API " + url);
    return this.http.get(url)
      .pipe((response) => response);
  }

  /**
   * This sets date of API first record: 2020-03-13
   * 
   * @param date is a a date to be set
   */
  public setBeginning(date: Date) {
    date.setUTCFullYear(2020, 3, 13);
    date.setUTCHours(0,0,0,0);
    return date;
  }
}  
