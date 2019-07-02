import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuid } from 'uuid';
import { environment } from 'src/environments/environment';
import { MatPaginator, MatDialog, MatTable, MatTableDataSource, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import {Observable} from 'rxjs';
import { Car } from './create-cars-mania.data';

@Component({
  selector: 'app-create-cars-mania',
  templateUrl: './create-cars-mania.component.html',
  styleUrls: ['./create-cars-mania.component.css']
})

export class CreateCarsManiaComponent implements OnInit {

  apiUrl = environment.apiUrl;
  carsUrl = this.apiUrl + "carsmania";
  car: Car;
  cars: Array<Car> = [];
  isValidFormSubmitted: boolean = false;
  message: string = "";
  dataSource;
  displayedColumns: string[] = ['id','carName', 'carDesc', 'carImageUrl', 'action'];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.car = new Car();
  }

  ngOnInit() {
    this.loadCars();
    // this.refresh();
  }

  private loadCars() {
    this.getCars().subscribe(data => {
      var res = data as Car[];
      var position = 1;
      res.forEach(element => {
        var car = new Car();
        car.carDesc = element.carDesc;
        car.carImageUrl = element.carImageUrl;
        car.carName = element.carName;
        car.id = element.id;
        car.position = position;
        position++;
        this.cars.push(car);
      });
      this.dataSource = new MatTableDataSource(this.cars);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCars() {
    return this.http.get(this.carsUrl);
  }
  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      //width: '250px',
      height: '50%',
      width: '50%',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){
    var car = new Car();
    car.carName = row_obj.carName;
    car.carDesc = row_obj.carDesc;
    car.carImageUrl = row_obj.carImageUrl;
    this.cars.push(car);
    this.dataSource._updateChangeSubscription()  // THIS WILL DO
    this.table.renderRows();
  }

  updateRowData(row_obj){
    // this.dataSource = this.dataSource.filter((value,key)=>{
    //   if(value.id == row_obj.id){
    //     value.name = row_obj.name;
    //   }
    //   return true;
    // });
    this.refresh();
    return true;
  }

  deleteRowData(row_obj){
    // this.dataSource = this.dataSource.filter((value,key)=>{
    //   return value.id != row_obj.id;
    // });
    this.refresh();
  }
  refresh() {
    this.getCars().subscribe((data: Car[]) => {
      this.dataSource.data = data;
    });
  }
}
