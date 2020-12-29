import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { CountryByDayData, CountryData } from '../country.module';
import { DatabaseService } from '../database.service';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [DatePipe]
})
export class CountryComponent implements OnInit {

  name: string;
  country: CountryData;
  activeCases: number;
  deadCases: number;
  recoveredCases: number;

  // Pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], 'Active Cases'];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // Historical development
  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];
  lineChartOptions = {
    responsive: true,
  };
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  flag: Boolean = false;

  // Last 7 days
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  flag7: Boolean = false;

  constructor(
        private actRoute: ActivatedRoute,
        private router: Router,
        private service: StatsService,
        public dbService: DatabaseService,
        private datePipe: DatePipe) {
    this.name = this.actRoute.snapshot.params.country;
  }

  async ngOnInit(): Promise<void> {
    await this.getSummary();
    await this.getCData();
  }

  async getSummary() {
    this.dbService.getCountry(this.name).subscribe(async (country: CountryData) => {
      if (country) {
        let today = new Date();
        let storageDate = new Date(country.Date);
        if (this.datePipe.transform(today, 'dd-MM-yyyy') == this.datePipe.transform(storageDate, 'dd-MM-yyyy')) {
          this.country = country;
          this.activeCases = this.country.TotalConfirmed - this.country.TotalRecovered - this.country.TotalDeaths;
          this.deadCases = 100 / this.country.TotalConfirmed * this.country.TotalDeaths;
          this.recoveredCases = 100 / this.country.TotalConfirmed * this.country.TotalRecovered;
          this.pieChartData = [this.deadCases, this.recoveredCases, 100 - this.deadCases - this.recoveredCases];
        } else {
          await this.getAllData();
        }
      }
      else {
        await this.getAllData();
      }
    });
  }

  async getAllData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getData().toPromise().then(
        async (res: any) => {
          let summaryData = res;
          this.country = summaryData.Countries.find(x => x.Slug == this.name);
          if (this.country) {
          this.activeCases = this.country.TotalConfirmed - this.country.TotalRecovered - this.country.TotalDeaths;
          this.deadCases = 100 / this.country.TotalConfirmed * this.country.TotalDeaths;
          this.recoveredCases = 100 / this.country.TotalConfirmed * this.country.TotalRecovered;
          this.pieChartData = [this.deadCases, this.recoveredCases, 100 - this.deadCases - this.recoveredCases];
          await this.dbService.updateCountry(this.country);
          } else {
            this.router.navigate([""]);
          }
        }
      )
    })
    return promise;
  }

  async getCData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getCData(this.name).toPromise().then(
        (res: any) => {
          this.getSortedHistoricalData(res);
          this.getLastWeek(res);
          this.flag = true;
        }
      )
    })
    return promise;
  }

  getSortedHistoricalData(data: Array<CountryByDayData>) {
    let Confirmed = [];
    let Recovered = [];
    let Deaths = [];
    this.lineChartLabels = [];
    data.forEach(element => {
      Confirmed.push(element.Confirmed);
      Recovered.push(element.Recovered);
      Deaths.push(element.Deaths);
      this.lineChartLabels.push(this.datePipe.transform(element.Date, 'dd MMM'));
    });
    this.lineChartData = [
      { data: Deaths, label: 'Total Deaths' },
      { data: Recovered, label: 'Total Recovered' },
      { data: Confirmed, label: 'Total Cases' },
    ];
  }

  getLastWeek(data: Array<CountryByDayData>) {
    let Confirmed = [];
    let Recovered = [];
    let Deaths = [];
    let len = data.length;
    for (let i = 0; i < 7; i++) {
      Confirmed.push(data[len - 7 + i].Confirmed - data[len - 7 + i - 1].Confirmed);
      Recovered.push(data[len - 7 + i].Recovered - data[len - 7 + i - 1].Recovered);
      Deaths.push(data[len - 7 + i].Deaths - data[len - 7 + i - 1].Deaths);
      this.barChartLabels.push(this.datePipe.transform(data[len - 7 + i].Date, 'dd MMM'));
    }
    this.barChartData = [
      { data: Deaths, label: 'Daily Deaths' },
      { data: Recovered, label: 'Daily Recovered' },
      { data: Confirmed, label: 'Daily New Cases' },
    ];
  }
}
