import { Component, OnInit } from '@angular/core';
import { Country } from '../country.module';
import { StatsService } from '../stats.service';

@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css']
})
export class WorldwideComponent implements OnInit {

  constructor(public statsService: StatsService) { }

  ngOnInit() {
  }

}
