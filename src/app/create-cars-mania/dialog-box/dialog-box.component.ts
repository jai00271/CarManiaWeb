import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Car } from '../create-cars-mania.data';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {
  action: string;
  local_data: any;
  apiUrl = environment.apiUrl;
  carUrl: string = this.apiUrl + "carsmania/";

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Car) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit() {
  }
  doAction() {
    if (this.action == 'Add') {
      var car = new Car();
      car.carName = this.local_data.carName;
      car.carDesc = this.local_data.carDesc;
      car.carImageUrl = this.local_data.carImageUrl;
      this.Save(car);
    } else if (this.action == 'Delete') {
      this.Delete(this.local_data.id);
    } else if (this.action == 'Update') {
      this.Update(this.local_data);
    }
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  Save(car: Car) {
    let body = JSON.stringify(car);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(this.carUrl, body, httpOptions).subscribe();
  }

  Update(car: Car) {
    var carWithoutId = new CarWithoutId();
    carWithoutId.carImageUrl = car.carImageUrl;
    carWithoutId.carDesc = car.carDesc;
    carWithoutId.carName = car.carName;
    var carData =
    {
      id: car.id
    };
    car.id = null;
    var carUpdateUrl = this.carUrl + "update?where=" + encodeURIComponent(JSON.stringify(carData));
    let body = JSON.stringify(carWithoutId);
    this.http.post(carUpdateUrl, body, httpOptions).subscribe();
  }

  Delete(id: string) {
    var deleteUrl = this.carUrl + id;
    this.http.delete(deleteUrl).subscribe();
  }
}

export class CarWithoutId{
  carName: string;
  carDesc: string;
  carImageUrl: string;
}
