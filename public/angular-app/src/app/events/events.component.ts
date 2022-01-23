import { Component, OnInit } from '@angular/core';

import { EventApiService } from '../event-api.service';
export class location {
  #place: string;
  #coordinates : number [];

  constructor(place: string, coordinates: number []) {
    this.#place = place;
    this.#coordinates =coordinates;
  }

  get place(): string {
    return this.#place;
  }
  set place(value: string) {
    this.#place = value;
  }

  get coordinates(): number[] {
    return this.#coordinates;
  }
  set coordinates(value: number []) {
    this.#coordinates = value;
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
  info: string;

  constructor(private eventService : EventApiService) {
    this.offset = 0
    this.queryString = ""
    this.info = ""
  }

  ngOnInit(): void {
    this._getAllEvents()
  }

  private _getAllEvents() : void {
    this.eventService.getEvents(this.queryString)
    .then(response => {
      this.events = response;
    })
    .catch(this.errorHandler)
  }

  prev() :void {
    if (this.offset - 5 < 0 ) {
      this.info = "This is the first page"
      return;
    }
    this.info = ""
    this.offset = this.offset - 5
    this.queryString = "?offset=" + this.offset 
    this._getAllEvents();
  }
  next() :void {
    if (this.events.length < 5 || this.events.length === 0) {
      this.info = "This is the last page"
      return;
    }
    this.info = ""
    this.offset = this.offset + 5
    this.queryString = "?offset=" + this.offset 
    this._getAllEvents();
  }


  private errorHandler(err : any) : void {
    console.log("error when getting all data", err);
  }
}
