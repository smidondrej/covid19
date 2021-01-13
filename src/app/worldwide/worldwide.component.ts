import { Component, OnInit } from '@angular/core';
import { CountryData, GlobalData, SummaryData } from '../country.module';
import { StatsService } from '../stats.service';
import { DatePipe } from '@angular/common';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { element } from 'protractor';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css'],
  providers: [DatePipe]
})
export class WorldwideComponent implements OnInit {

  title = 'covid19-tracker';
  summaryData: SummaryData;
  countries: Array<CountryData>;
  currentDate: string;
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
    public dbService: DatabaseService,
    private service: StatsService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    let date = new Date();
    this.currentDate = this.datePipe.transform(date,'dd-MMM-yyyy');
    this.getAllData();
    this.get7DaysData();
    this.getAllHistoryData();
  }

  getAllData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getData().toPromise().then(
        (res: any) => {
          this.summaryData = res;
          this.activeCases = this.summaryData.Global.TotalConfirmed - this.summaryData.Global.TotalRecovered - this.summaryData.Global.TotalDeaths;
          this.deadCases = 100 / this.summaryData.Global.TotalConfirmed * this.summaryData.Global.TotalDeaths;
          this.recoveredCases = 100 / this.summaryData.Global.TotalConfirmed * this.summaryData.Global.TotalRecovered;
          this.pieChartData = [this.deadCases, this.recoveredCases, 100 - this.deadCases - this.recoveredCases];
          this.countries = this.summaryData.Countries;
        }
      )
    })
    return promise;
  }

  getAllHistoryData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getWorldData().toPromise().then(
        (res: any) => {
          this.getSortedHistoricalData(res);
          this.flag = true;
        }
      )
    })
    return promise;
  }

  get7DaysData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.get7DaysData().toPromise().then(
        (res: any) => {
          this.getLast7(res);
          this.flag7 = true;
        }
      )
    })
    return promise;
  }

  getSortedHistoricalData(data) {
    this.service.setBeginning(this.service.beginning);
    this.lineChartLabels = this.getDateArray(this.service.beginning);
    // This is the right sorting (sort by one field only), but it is not giving good curve,
    // because TotalRecovered has to be non-decreasing function
    // data = data.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed)
    let TotalConfirmed = [];
    let TotalRecovered = [];
    let TotalDeaths = [];
    data.forEach(element => {
      TotalConfirmed.push(element.TotalConfirmed);
      TotalRecovered.push(element.TotalRecovered);
      TotalDeaths.push(element.TotalDeaths);
    });
    TotalConfirmed = TotalConfirmed.sort((a, b) => a - b)
    TotalRecovered = TotalRecovered.sort((a, b) => a - b)
    TotalDeaths = TotalDeaths.sort((a, b) => a - b)
    this.lineChartData = [
      { data: TotalDeaths, label: 'Total Deaths' },
      { data: TotalRecovered, label: 'Total Recovered' },
      { data: TotalConfirmed, label: 'Total Cases' },
    ];
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

  getLast7(data: Array<GlobalData>) {
    data = data.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed)
    let NewConfirmed = [];
    let NewRecovered = [];
    let NewDeaths = [];
    let len = data.length
    for (let i = 0; i < 7; i++) {
      if (i < len) {
        NewConfirmed.push(data[i].NewConfirmed);
        NewRecovered.push(data[i].NewRecovered);
        NewDeaths.push(data[i].NewDeaths);
      } else {
        // normally this shouldn't be needed but API is not not very well behaved and sometimes returns
        // less days than 7 and without dates no one can say which day is missing
        NewConfirmed.push(0);
        NewRecovered.push(0);
        NewDeaths.push(0);
      }
    }
    let day = new Date();
    day.setDate(day.getUTCDate() - 7);
    let dates = this.getDateArray(day);
    dates.pop();
    this.barChartLabels = dates;
    this.barChartData = [
      { data: NewDeaths, label: 'Daily Deaths' },
      { data: NewRecovered, label: 'Daily Recovered' },
      { data: NewConfirmed, label: 'Daily New Cases' },
    ];
  }
}
