import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { CountryByDayData, CountryData } from '../country.module';
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
  barChartLabels: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  flag7: Boolean = false;

  constructor(private actRoute: ActivatedRoute, private service: StatsService, private datePipe: DatePipe) {
    this.name = this.actRoute.snapshot.params.country;
  }

  ngOnInit(): void {
    this.getAllData();
    this.get7DaysData();
    this.getAllHistoryData();
  }

  getAllData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getData().toPromise().then(
        (res: any) => {
          let summaryData = res;
          this.country = summaryData.Countries.find(x => x.Slug == this.name);
          this.activeCases = this.country.TotalConfirmed - this.country.TotalRecovered - this.country.TotalDeaths;
          this.deadCases = 100 / this.country.TotalConfirmed * this.country.TotalDeaths;
          this.recoveredCases = 100 / this.country.TotalConfirmed * this.country.TotalRecovered;
          this.pieChartData = [this.deadCases, this.recoveredCases, 100 - this.deadCases - this.recoveredCases];
        }
      )
    })
    return promise;
  }

  getAllHistoryData() {
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

  getSortedHistoricalData(data: Array<CountryByDayData>) {
    this.service.setCountryBeginning(this.service.countryBeginning);
    this.lineChartLabels = this.getDateArray(this.service.countryBeginning);
    let Confirmed = [];
    let Recovered = [];
    let Deaths = [];
    data.forEach(element => {
      Confirmed.push(element.Confirmed);
      Recovered.push(element.Recovered);
      Deaths.push(element.Deaths);
    });
    this.lineChartData = [
      { data: Deaths, label: 'Total Deaths' },
      { data: Recovered, label: 'Total Recovered' },
      { data: Confirmed, label: 'Total Cases' },
    ];
  }

  get7DaysData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.get7DaysCountryData(this.name).toPromise().then(
        (res: any) => {
          console.log("get7DaysData");
          this.getLast7(res);
          console.log(res);
          this.flag7 = true;
        }
      )
    })
    return promise;
  }

  getLast7(data: Array<CountryByDayData>) {
    console.log("getLast7");
    let Confirmed = [];
    let Recovered = [];
    let Deaths = [];
    let day = new Date();
    day.setDate(day.getUTCDate() - 6);
    data.forEach(element => {
      Confirmed.push(element.Confirmed);
      Recovered.push(element.Recovered);
      Deaths.push(element.Deaths);
    });
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
