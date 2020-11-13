import { Component, OnInit } from '@angular/core';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  constructor(public statsService: StatsService) { }

  ngOnInit(): void {
    console.log('Summary component init')
    this.statsService.getSummary();
  }

}
