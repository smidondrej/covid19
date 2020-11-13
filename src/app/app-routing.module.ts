import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldwideComponent } from './worldwide/worldwide.component';

const routes: Routes = [
  { path: "", component: WorldwideComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
