import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Event } from './events/events.component';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  #baseUrl: string = environment.eventApiURL;

  constructor(private http : HttpClient) { }

  public getEvents(query: string): Promise<Event[]> {
    const url:string = this.#baseUrl + "events" + query;    
    return this.http.get(url)
           .toPromise()
           .then(response => {
             console.log(response);
             return response as Event[] 
           })
           .catch(this.errorHandler)
  }

  public getEvent(id : string): Promise<Event> {
    const url:string = this.#baseUrl + "events/" + id;
    return this.http.get(url)
           .toPromise()
           .then(response => {
            console.log(response);
             return response as Event 
           })
           .catch(this.errorHandler)
  }
  
  public createEvent(event : Event) : Promise<Event> {
    const url:string = this.#baseUrl + "events/";
    return this.http.post(url, event)
          .toPromise()
          .then(response => {
            console.log(response);
            return response as Event
          })
          .catch(this.errorHandler)
  }

  public updateEvent(id:string, event : Event) : Promise<Event> {
    const url:string = this.#baseUrl + "events/" + id;
    return this.http.patch(url, event)
          .toPromise()
          .then(response => {
            console.log(response);
            return response as Event
          })
          .catch(this.errorHandler)
  }

    
  public deleteEvent(id : string) : Promise<Event> {
    const url:string = this.#baseUrl + "events/" + id;
    return this.http.delete(url)
          .toPromise()
          .then(response => {
            console.log(response);
          })
          .catch(this.errorHandler)
  }

  private errorHandler(err : any):Promise<any> {
    console.log("Error on event service", err);
    return Promise.reject( err.message || err)
  }
}
