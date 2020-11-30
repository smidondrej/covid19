import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { WorldwideComponent } from './worldwide/worldwide.component';

const routes: Routes = [
  { path: "", component: WorldwideComponent },
  { path: ":contry", component: CountryComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
