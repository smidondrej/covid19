import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryData } from '../country.module';
import { DatabaseService } from '../database.service';
import { News } from '../news.module';
import { StatsService } from '../stats.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [DatePipe]
})
export class NewsComponent implements OnInit {

  news: News[] = [];
  selectedCountry: CountryData;
  description: string;
  countries: CountryData[];
  slug: string;

  constructor(
    private actRoute: ActivatedRoute,
    private service: StatsService,
    public dbService: DatabaseService) {
      this.slug = this.actRoute.snapshot.params.country;
      if (!this.slug) {
        this.slug = "worldwide";
      }
    }

  ngOnInit(): void {
    this.getAllCountries();
    // this.getNews();
  }

  displayNewsEntry(): boolean {
    if (this.dbService.isAdmin() && this.countries?.length) {
      return true;
    }
    return false;
  }

  getAllCountries() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getData().toPromise().then(
        (res: any) => {
          let summaryData = res;
          this.countries = summaryData.Countries;
          let worldwide = new CountryData;
          worldwide.Country = "Worldwide";
          worldwide.Slug = "worldwide";
          this.countries.push(worldwide);
          this.getNews();
        }
      )
    })
    return promise;
  }

  async getNews() {
    if (this.slug == "worldwide") {
      this.news = [];
      this.countries.forEach(async (element) => {
        this.dbService.getNews(element.Slug).subscribe((news: News[]) => {
          news.forEach(elem => {
            this.news.push(elem)
          });
          // this.news.concat(news);
          console.log(element.Slug, this.news);
        });
      });
    } else {
      this.dbService.getNews(this.slug).subscribe((news: News[]) => {
        this.news = news;
      });
    }
  }

  addNews() {
    let date = new Date();
    let news: News = {
      country: this.selectedCountry.Country,
      date: date.toISOString(),
      uid: this.dbService.user.uid,
      user: this.dbService.user.displayName,
      description: this.description
    };
    this.dbService.addNews(this.selectedCountry.Slug, news);
    this.selectedCountry = undefined;
    this.description = undefined;
  }
}
