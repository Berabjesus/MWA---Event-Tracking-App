import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AttendeeApiService } from '../attendee-api.service';
import { EventApiService } from '../event-api.service';
export class Attendee {
  #_id : string;
  #name: string;
  #rsvp: string;

  constructor(id :string, name :string, rsvp :string){
    this.#_id =id;
    this.#name =name;
    this.#rsvp =rsvp;
  }

  get name(): string {
    return this.#name;
  }
  set name(value: string) {
    this.#name = value;
  }

  get _id() {return this.#_id}
  set _id(id:any) {this.#_id = id}

  get rsvp(): string {
    return this.#rsvp;
  }
  set rsvp(value: string) {
    this.#rsvp = value;
  }

}

import { Event } from '../events/events.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event!: Event;
  attendees! : Attendee[];
  queryString : string;
  offset: number;
  info: string;
  showUpdateForm:boolean;

  constructor(private eventService : EventApiService, private attendeeService : AttendeeApiService, private route: ActivatedRoute, private router : Router) { 
    this.offset = 0
    this.queryString = ""
    this.info = ""
    this.showUpdateForm = false;
  }

  ngOnInit(): void {
    this.eventService.getEvent(this.route.snapshot.params["eventId"])
    .then(response => {
      this.event = response
      this._getAllAttendees();
    }).catch(this.errorHandler)

  }

  private _getAllAttendees() : void {
    this.attendeeService.getAttendees(this.route.snapshot.params["eventId"], this.queryString)
    .then(response => {
      this.attendees = response;
    })
    .catch(this.errorHandler)
  }

  onEventDelete() :void {    
    this.eventService.deleteEvent(this.route.snapshot.params["eventId"])
        .then(response => {
          this.router.navigate(["events/"])
        })
        .catch(this.errorHandler)

  }

  onAddAttendee(data : any) :void {       
    this.attendeeService.createAttendee(this.route.snapshot.params["eventId"], data)
        .then(response => {
          this._getAllAttendees();
        })
        .catch(this.errorHandler)
  }

  onEventUpdate(data : any) :void {
    this.eventService.updateEvent(this.route.snapshot.params["eventId"], data)
        .then(response => {
          this.router.navigate(["events/" + this.route.snapshot.params["eventId"]])
          this.showUpdateForm = false
        })
        .catch(this.errorHandler)
    
  }

  onDeleteAttendee(id: string) :void {
    this.attendeeService.deleteAttendee(this.route.snapshot.params["eventId"], id)
        .then(response => {
          this._getAllAttendees();
        })
        .catch(this.errorHandler)
  }

  onShowUpdateForm() :void {
    this.showUpdateForm = true
  }

  prev() :void {
    if (this.offset - 5 < 0 ) {
      this.info = "This is the first page"
      return;
    }
    this.info = ""
    this.offset = this.offset - 5
    this.queryString = "?offset=" + this.offset 
    this._getAllAttendees();
  }
  next() :void {
    if (this.attendees.length < 5 || this.attendees.length === 0) {
      this.info = "This is the last page"
      return;
    }
    this.info = ""
    this.offset = this.offset + 5
    this.queryString = "?offset=" + this.offset 
    this._getAllAttendees();
  }

  private errorHandler(err : any) : void {
    console.log("error at event", err);
  }
}
