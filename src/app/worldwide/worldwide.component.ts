import { Component, OnInit } from '@angular/core';
import { CountryData, GlobalData, SummaryData } from '../country.module';
import { StatsService } from '../stats.service';
import { DatePipe } from '@angular/common';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { element } from 'protractor';

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
  deadCases: number;
  activeCases: number;

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
  // lineChartColors: Color[] = [
  //   {
  //     borderColor: 'black',
  //     backgroundColor: 'rgba(255,255,0,0.28)',
  //   },
  // ];
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

  constructor(private service: StatsService, private datePipe: DatePipe) { }

  ngOnInit() {
    let date = new Date();
    this.currentDate = this.datePipe.transform(date,'dd-MMM-yyyy');
    this.lineChartLabels = this.getDateArray(this.service.beginning);
    this.getAllData();
    this.get7DaysData();
    this.getAllHistoryData();
  }

  getAllData() {
    const promise = new Promise((resolve, reject) =>  {
      this.service.getData().toPromise().then(
        (res: any) => {
          this.summaryData = res;
          this.deadCases = 100 / this.summaryData.Global.TotalConfirmed *  this.summaryData.Global.TotalDeaths;
          this.activeCases = 100 / this.summaryData.Global.TotalConfirmed *  this.summaryData.Global.TotalRecovered;
          this.pieChartData = [this.deadCases, this.activeCases, 100 - this.deadCases - this.activeCases];
          this.getSortedData();
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
  
  getSortedData() {
    this.countries = this.summaryData.Countries;
  }

  getSortedHistoricalData(data) {
    let TotalConfirmed = [];
    let TotalRecovered = [];
    let TotalDeaths = [];
    data.forEach(element => {
      TotalConfirmed.push(element.TotalConfirmed);
      TotalRecovered.push(element.TotalRecovered);
      TotalDeaths.push(element.TotalDeaths);
    });
    TotalConfirmed = this.getProper(TotalConfirmed);
    TotalRecovered = this.getProper(TotalRecovered);
    TotalDeaths = this.getProper(TotalDeaths);
    this.lineChartData = [
      { data: TotalConfirmed, label: 'Crude oil prices' },
      { data: TotalRecovered, label: 'Crude oil prices' },
      { data: TotalDeaths, label: 'Crude oil prices' },
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

  getProper(arr: Array<number>) {
    let i = 1;
    let len = arr.length;
    for (i = 1; i < len + 1; i++) {
      arr[i] += arr[i-1];
    }
    return arr;
  }

  getLast7(data: Array<GlobalData>) {
    console.log(data);
    let NewConfirmed = [];
    let NewRecovered = [];
    let NewDeaths = [];
    let day = new Date();
    console.log(day);
    day.setDate(day.getDate() - 6);
    data.forEach(element => {
      NewConfirmed.push(element.NewConfirmed);
      NewRecovered.push(element.NewRecovered);
      NewDeaths.push(element.NewDeaths);
    });
    console.log(NewConfirmed);
    console.log(NewRecovered);
    this.barChartData = [
      { data: NewConfirmed, label: 'Crude oil prices' },
      { data: NewRecovered, label: 'Crude oil prices' },
      { data: NewDeaths, label: 'Crude oil prices' },
    ];
    this.barChartLabels = this.getDateArray(day);
  }
}
