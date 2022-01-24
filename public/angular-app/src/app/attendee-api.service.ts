import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Attendee } from './event/event.component';
@Injectable({
  providedIn: 'root'
})
export class AttendeeApiService {
  #baseUrl: string = environment.attendeeApiURL;

  constructor(private http : HttpClient) { }

  public getAttendees(id:string, query: string): Promise<Attendee[]> {
    const url:string = this.#baseUrl + id + "/attendees" + query;
    return this.http.get(url)
           .toPromise()
           .then(response => {
            console.log(response);
             return response as Attendee[] 
           })
           .catch(this.errorHandler)
  }

    
  public createAttendee(id:string, attendee : Attendee) : Promise<Attendee> {
    const url:string = this.#baseUrl + id + "/attendees";

    return this.http.post(url, attendee)
          .toPromise()
          .then(response => {
            console.log(response);
            return response as Attendee
          })
          .catch(this.errorHandler)
  }

  public updateAttendee(eventId : string, attendeeId : string, data : Attendee) : Promise<Event> {
    const url:string = this.#baseUrl + eventId + "/attendees/" + attendeeId;
    return this.http.patch(url, data)
          .toPromise()
          .then(response => {
            console.log(response);
            return response as Event
          })
          .catch(this.errorHandler)
  }

  public deleteAttendee(eventId : string, attendeeId : string) : Promise<Attendee> {
    const url:string = this.#baseUrl + eventId + "/attendees/" + attendeeId;
    return this.http.delete(url)
          .toPromise()
          .then(response => {
            console.log(response);
            return response as Attendee
          })
          .catch(this.errorHandler)
  }


  private errorHandler(err : any):Promise<any> {
    console.log("Error on attendee service", err);
    return Promise.reject( err.message || err)
  }
}
