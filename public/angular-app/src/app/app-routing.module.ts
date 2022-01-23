import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { EventsComponent } from "./events/events.component";
import { EventComponent } from "./event/event.component";

const routes: Routes = [
  {path : '', component: HomeComponent},
  {path : 'events', component: EventsComponent},
  {path : 'events/:eventId', component: EventComponent},
  {path : 'search', component: SearchComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRouterModule{}