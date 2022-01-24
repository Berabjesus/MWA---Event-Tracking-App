import { Component, OnInit } from '@angular/core';

import { EventApiService } from '../event-api.service';
import { Event } from '../events/events.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  events!: Event[];
  queryString : string;
  info: string;
  pagInfo: string;
  offset: number;
  searchInfo: string
  constructor(private eventService : EventApiService) {
    this.queryString = ""
    this.info = ""
    this.pagInfo = ""
    this.offset = 0
    this.searchInfo = ""
   }

  ngOnInit(): void {
  }

  private _getResultEvents() : void {
    this.eventService.getEvents(this.queryString)
    .then(response => {
      if (response.length === 0) {
        this.searchInfo = "Nothing Found"
      } else {
        this.searchInfo = ""
      }
      this.events = response;
    })
    .catch(this.errorHandler)
  }

  onSubmit(data : any) :void {  
    if (data.filter === "" ) {
      this.searchErrorHandler("Filter")
      return;
    }   
    if (data.filter === "coordinate") {
        if (data.lat === "" && data.lng === "") {
          this.searchErrorHandler("coordinate")
          return;    
        }
        this.info = ""
        this.queryString = `?lat=${data.lat}&lng=${data.lng}`
      
    } else if(data.filter === "name" || data.filter === "place") {
        if (data.search === "") {
          this.searchErrorHandler("search field")
          return;    
        }
        this.info = ""
        data.filter === "name" ? 
          this.queryString = `?search=${data.search}` : 
          this.queryString = `?search=${data.search}&place=true`
    }
    this._getResultEvents();

  }

  prev() :void {
    if (this.offset - 5 < 0 ) {
      this.pagInfo = "This is the first page"
      return;
    }
    this.pagInfo = ""
    this.offset = this.offset - 5
    this.queryString = "?offset=" + this.offset 
    this._getResultEvents();
  }
  next() :void {
    if (!this.events || this.events.length < 5 || this.events.length === 0) {
      this.pagInfo = "This is the last page"
      return;
    }
    this.pagInfo = ""
    this.offset = this.offset + 5
    this.queryString = "?offset=" + this.offset 
    this._getResultEvents();
  }

  private searchErrorHandler(msg  : string) : void {
    this.info = msg + " can not be empty"
  }

  private errorHandler(err : any) : void {
    console.log("error when getting all data", err);
  }
}

