import { Component, OnInit } from '@angular/core';
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient } from '@angular/common/http';
import { CarsEntity } from './cars.data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  //carsUrl = "http://localhost:3000/api/carsmania";
  //carUrl = "http://localhost:3000/api/carsmania/";
  apiUrl = environment.apiUrl;
  //carsUrl = "http://52.14.178.44:3000/api/carsmania";
  //carUrl = "http://52.14.178.44:3000/api/carsmania/";
  carsUrl = this.apiUrl + "carsmania";
  carUrl = this.apiUrl + "carsmania/";
  car: CarsEntity;
  cars: Array<CarsEntity> = [];
  showCarDetail: boolean;

  public staticList = [];
  public query = '';

  constructor(private http: HttpClient) {
    this.car = new CarsEntity();
  }

  ngOnInit() {
    this.getCars().subscribe(
      (data) => {
        this.cars = data as CarsEntity[];
        this.staticList = this.cars.map(function(a) {return a["carName"];});
        this.car = this.cars[0];
      }
    );
  }

  getCars() {
    return this.http.get(this.carsUrl);
  }
  getCar(id: string) {
    this.http.get(this.carUrl + id).subscribe(
      (data) => {
        this.car = data as CarsEntity;
      }
    )
  }

  handleStaticResultSelected(result) {
    //this.search = result;
    this.car = this.cars.filter(function(item) {
      return item.carName === result;
    })[0];
    this.car;
  }
}
