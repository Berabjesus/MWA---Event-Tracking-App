import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Event } from './events/events.component';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {
  #baseUrl: string = 'http://localhost:3000/api/';

  constructor(private http : HttpClient) { }

  public getEvents(query: string): Promise<Event[]> {
    const url:string = this.#baseUrl + "events" + query;
    console.log(url);
    
    return this.http.get(url)
           .toPromise()
           .then(response => {
             console.log(response);
             return response as Event[] 
           })
           .catch(this.errorHandler)
  }

  private errorHandler(err : any):Promise<any> {
    console.log("Error on get all", err);
    return Promise.reject(err.message && err.message || err)
  }
}
