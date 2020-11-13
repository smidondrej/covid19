import { Component, OnInit } from '@angular/core';
import { Country } from '../country.module';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  countries: Country[];

  constructor() { }

  ngOnInit(): void {
  }

}
