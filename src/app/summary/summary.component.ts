import { Component, OnInit } from '@angular/core';
import { Country } from '../country.module';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  country: Country;

  constructor(public statsService: StatsService) { }

  async ngOnInit() {
    // console.log('Summary component init')
    // this.statsService.getSummary();
    this.country = await this.statsService.getCountry('Worldwide');
    // console.log("Summary component")
    // await console.log(this.country)
  }

}
