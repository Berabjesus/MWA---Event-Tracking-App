import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Attendee } from './event/event.component';

@Injectable({
  providedIn: 'root'
})
export class AttendeeApiService {
  #baseUrl: string = 'http://localhost:3000/api/events/';

  constructor(private http : HttpClient) { }

  public getAttendees(id:string, query: string): Promise<Attendee[]> {
    const url:string = this.#baseUrl + id + "/attendees" + query;
    return this.http.get(url)
           .toPromise()
           .then(response => {
             return response as Attendee[] 
           })
           .catch(this.errorHandler)
  }

    
  public createAttendee(id:string, attendee : Attendee) : Promise<Attendee> {
    const url:string = this.#baseUrl + id + "/attendees";

    return this.http.post(url, attendee)
          .toPromise()
          .then(response => {
            return response as Attendee
          })
          .catch(this.errorHandler)
  }


  private errorHandler(err : any):Promise<any> {
    console.log("Error on attendee service", err);
    return Promise.reject( err.message || err)
  }
}
