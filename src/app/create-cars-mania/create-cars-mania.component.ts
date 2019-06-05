import { Component, OnInit } from '@angular/core';
import { CarsEntity } from '../cars/cars.data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-create-cars-mania',
  templateUrl: './create-cars-mania.component.html',
  styleUrls: ['./create-cars-mania.component.css']
})

export class CreateCarsManiaComponent implements OnInit {

  carSaveUrl: string = "http://52.14.178.44:3000/api/carsmania";
  //carSaveUrl: string = "http://localhost:3000/api/carsmania";
  car: CarsEntity;
  cars: CarsEntity[];
  isValidFormSubmitted: boolean = false;
  message: string = "";

  constructor(private http: HttpClient) {
    this.car = new CarsEntity();
  }

  ngOnInit() {
  }
  submit(form) {
    this.isValidFormSubmitted = false;
    if (form.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    this.Save();
  }
  Save() {
    //this.car.id = this.newGuid().toString();
    let body = JSON.stringify(this.car);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(this.carSaveUrl, body, httpOptions).subscribe(
      (data) => {
        this.message = "Success";
      },
      err => {
        this.message = "Error occurred";
      }
    )
  }

  newGuid() {
    return uuid();
    // return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //     var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    //     return v.toString(16);
    // });
}

}
