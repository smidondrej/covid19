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
  public beginning: Date = new Date('2020-04-13T00:00:00');
  
  getData(): Observable<any> {
    return this.http.get(this.url)
      .pipe((response) => response);
  }

  getWorldData(): Observable<any> {
    console.log(this.beginning);
    let url = this.url_history + "?from=" + this.beginning.toISOString() + "&to=" + (new Date()).toISOString()
    console.log("call API " + url)
    return this.http.get(url)
      .pipe((response) => response);
  }

  get7DaysData(): Observable<any> {
    let today = new Date();
    let day = new Date();
    day.setDate(today.getDate() - 6);
    // let t = this.datePipe.transform(today, 'yyyy-mm-dd');
    // t += 'T00:00:00';
    // let d = this.datePipe.transform(day, 'yyyy-mm-dd');
    // d += 'T00:00:00';
    console.log(today);
    console.log(day);
    let url = this.url_history + "?from=" + day.toISOString() + "&to=" + today.toISOString();
    console.log("call API " + url)
    return this.http.get(url)
      .pipe((response) => response);
  }
}  
