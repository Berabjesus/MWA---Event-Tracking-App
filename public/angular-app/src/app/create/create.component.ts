import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../event-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private eventService : EventApiService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(data : any) :void {
    data.location = {
      place: data.place,
      coordinates : [data.lng, data.lat]
    }    
    this.eventService.createEvent(data)
        .then(response => {
          console.log(response);
          this.router.navigate(["events/"+response._id])
        })
        .catch(this.errorHandler)
  }

  private errorHandler(err : any):Promise<any> {
    console.log("Error on create", err);
    return Promise.reject( err.message || err)
  }

}
