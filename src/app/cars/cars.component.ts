import { Component, OnInit } from '@angular/core';
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient } from '@angular/common/http';
import { CarsEntity } from './cars.data';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  carsUrl = "http://localhost:3000/api/carsmania";
  carUrl = "http://localhost:3000/api/carsmania/";
  car: CarsEntity;
  cars: Array<CarsEntity> = [];
  showCarDetail: boolean;

  public url = 'http://suggestqueries.google.com/complete/search';
  public params = {
    hl: 'en',
    ds: 'yt',
    xhr: 't',
    client: 'youtube',
    //q: query
  };
  public search = '';

  constructor(private http: HttpClient) {
    this.car = new CarsEntity();
  }

  ngOnInit() {
    this.getCars().subscribe(
      (data) => {
        this.cars = data as CarsEntity[];
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

  handleResultSelected(result) {
    this.search = result;
  }
}
