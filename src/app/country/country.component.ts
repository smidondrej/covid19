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
  private provinces: number;

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
  barChartLabels: Label[];
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
    await this.get7DaysData();
    await this.getAllHistoryData();
  }

  async getSummary() {
    this.dbService.getCountry(this.name).subscribe(async (country: CountryData) => {
      let today = new Date();
      if (country) {
        this.country = country;
        this.activeCases = this.country.TotalConfirmed - this.country.TotalRecovered - this.country.TotalDeaths;
        this.deadCases = 100 / this.country.TotalConfirmed * this.country.TotalDeaths;
        this.recoveredCases = 100 / this.country.TotalConfirmed * this.country.TotalRecovered;
        this.pieChartData = [this.deadCases, this.recoveredCases, 100 - this.deadCases - this.recoveredCases];
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

  async getAllHistoryData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getCountryData(this.name).toPromise().then(
        (res: any) => {
          this.getSortedHistoricalData(res);
          this.flag = true;
        }
      )
    })
    return promise;
  }

  // FIXME: for some countries not working properly, apparently problem with provinces
  getSortedHistoricalData(data: Array<CountryByDayData>) {
    this.service.setCountryBeginning(this.service.countryBeginning);
    this.lineChartLabels = this.getDateArray(this.service.countryBeginning);
    let Confirmed = new Array(data.length / this.provinces).fill(0);
    let Recovered = new Array(data.length / this.provinces).fill(0);
    let Deaths = new Array(data.length / this.provinces).fill(0);
    for (let i = 0; i < data.length; i++) {
      let idx = Math.floor(i / this.provinces)
      Confirmed[idx] += data[i].Confirmed;
      Recovered[idx] += data[i].Recovered;
      Deaths[idx] += data[i].Deaths;
    }
    this.lineChartData = [
      { data: Deaths, label: 'Total Deaths' },
      { data: Recovered, label: 'Total Recovered' },
      { data: Confirmed, label: 'Total Cases' },
    ];
  }

  async get7DaysData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.get7DaysCountryData(this.name).toPromise().then(
        (res: any) => {
          this.getLast7(res);
          this.flag7 = true;
        }
      )
    })
    return promise;
  }

  getLast7(data: Array<CountryByDayData>) {
    let Confirmed = [0, 0, 0, 0, 0, 0];
    let Recovered = [0, 0, 0, 0, 0, 0];
    let Deaths = [0, 0, 0, 0, 0, 0];
    let day = new Date();
    day.setDate(day.getUTCDate() - 6);
    this.provinces = data.length / 6;
    // TODO: download eight days (seven previous and subtract them to get daily increment)
    for (let i = 0; i < data.length; i++) {
      let idx = Math.floor(i / this.provinces)
      Confirmed[idx] += data[i].Confirmed;
      Recovered[idx] += data[i].Recovered;
      Deaths[idx] += data[i].Deaths;
    }
    this.barChartData = [
      { data: Deaths, label: 'Daily Deaths' },
      { data: Recovered, label: 'Daily Recovered' },
      { data: Confirmed, label: 'Daily New Cases' },
    ];
    this.barChartLabels = this.getDateArray(day);
  }

  getDateArray(start: Date) {
    let arr = new Array;
    let today = new Date();
    let dt = start;
    while (dt <= today) {
      arr.push(this.datePipe.transform(new Date(dt), 'dd MMM'));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }
}
