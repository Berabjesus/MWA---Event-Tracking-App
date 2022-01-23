import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';

export class location {
  #place: string;

  constructor(place: string) {
    this.#place = place;
  }

  get place(): string {
    return this.#place;
  }
  set place(value: string) {
    this.#place = value;
  }
}

export class Event {
  #_id :string;
  #name: string;
  #description: string;
  #location: location;

  constructor(id :string,description :string, location :location, name :string) {
    this.#_id =id;
    this.#name =name;
    this.#description =description;
    this.#location =location;
  }

  get name(): string {
    return this.#name;
  }
  set name(value: string) {
    this.#name = value;
  }

  get _id() {return this.#_id}
  set _id(id:any) {this.#_id = id}

  get description(): string {
    return this.#description;
  }
  set description(value: string) {
    this.#description = value;
  }
  get location(): location {
    return this.#location;
  }
  set location(value: location) {
    this.#location = value;
  }
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events!: Event[];
  queryString : string;
  offset: number;

  constructor(private eventService : EventApiService) {
    this.offset = 0
    this.queryString = ""
  }

  ngOnInit(): void {
    // this._getAllEvents()
  }

  private _getAllEvents() : void {
    this.eventService.getEvents(this.queryString)
    .then(response => {
      console.log("response at job component ", response);
      this.events = response;
    })
    .catch(this.errorHandler)
  }

  private errorHandler(err : any) : void {
    console.log("error when getting all data", err);
  }
}
