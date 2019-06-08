import { Component, OnInit } from '@angular/core';
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarsEntity, UserComment } from './cars.data';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../login/login.data';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

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
  carSaveUrl: string;
  car: CarsEntity;
  cars: Array<CarsEntity> = [];
  userComment: UserComment;
  userComments: Array<UserComment> = [];
  showCarDetail: boolean;
  isLiked: boolean;
  likeCount: number = 0;

  public staticList = [];
  public query = '';

  constructor(private http: HttpClient, private router: Router) {
    this.car = new CarsEntity();
    this.userComment = new UserComment();
  }

  ngOnInit() {
    let loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;
    if (loginResponse == null || loginResponse == undefined) {
      this.router.navigate(['/login']);
    }
    this.getCars().subscribe(
      (data) => {
        this.cars = data as CarsEntity[];
        this.staticList = this.cars.map(function (a) { return a["carName"]; });
        this.car = this.cars[0];
        //this.userComments.push(JSON.parse(this.car.comments) as UserComment);
        this.LoadComments();
      }
    );
  }

  private LoadComments() {
    this.likeCount = 0;
    if (this.car.comments != null || this.car.comments != undefined) {
      this.userComments = [];
      if (this.car.comments != "") {
        var userCommentJson = JSON.parse(this.car.comments);
        for (let index = 0; index < userCommentJson.length; index++) {
          var userComment = userCommentJson[index] as UserComment;
          //if (comment.comment != null || comment.comment != undefined) {
            if(userComment.comment == undefined){
              userComment.comment = null;
            }
          this.userComments.push(userComment);
          //}
          if (userComment.IsLiked) {
            this.likeCount += 1;
          }
          else {
            this.likeCount = 0;
          }
        }
      }
    } else {
      this.userComments = [];
    }
  }

  getCars() {
    return this.http.get(this.carsUrl);
  }
  getCar(id: string) {
    this.http.get(this.carUrl + id).subscribe(
      (data) => {
        this.car = data as CarsEntity;
        this.LoadComments();
      }
    )
  }
  submit() {
    this.Save();
  }
  findIndexToUpdate(newItem) {
    return newItem.UserId === this;
  }
  Save() {
    let loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;
    this.userComment.UserId = loginResponse.userId;
    this.userComment.IsLiked = this.isLiked;

    let updateItem = this.userComments.find(this.findIndexToUpdate, loginResponse.userId);
    let index = this.userComments.indexOf(updateItem);
    if (index >= 0) {
      this.UpdateComment();
    }
    else {
      this.userComments.push(this.userComment);
      this.car.comments = JSON.stringify(this.userComments);
      var carIdVal =
      {
        "id": this.car.id
      };
      this.carSaveUrl = this.apiUrl + "carsmania/update/?where=" + encodeURI(JSON.stringify(carIdVal)); //{"id":"5cf4b3762c470c162769e669"}
      let body = JSON.stringify(this.car);

      this.http.post(this.carSaveUrl, body, httpOptions).subscribe(
        (data) => {
          //alert('success');
          this.userComment.comment = "";
        },
        err => {
          //alert('error');
        }
      )
    }
  }
  private UpdateComment() {
    let loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;
    this.userComment.UserId = loginResponse.userId;
    this.userComment.IsLiked = this.isLiked;
    if(this.isLiked == undefined){
      this.userComment.IsLiked = false;
      this.isLiked = false;
    }

    let updateItem = this.userComments.find(this.findIndexToUpdate, loginResponse.userId);
    let index = this.userComments.indexOf(updateItem);
    // First like when there was no comment
    if (index == -1) {
      //index = 0;
      this.Save();
    }
    else {
      if (this.userComments.length > 0) {
        if (this.userComments[index].IsLiked != this.userComment.IsLiked) {
          this.userComments[index].IsLiked = this.userComment.IsLiked;
        }
      }
      else {
        this.userComments.push(this.userComment);
      }
      this.car.comments = JSON.stringify(this.userComments);
      var carIdVal =
      {
        "id": this.car.id
      };
      this.carSaveUrl = this.apiUrl + "carsmania/update/?where=" + encodeURI(JSON.stringify(carIdVal)); //{"id":"5cf4b3762c470c162769e669"}
      let body = JSON.stringify(this.car);

      this.http.post(this.carSaveUrl, body, httpOptions).subscribe(
        (data) => {
          //alert('success');
        },
        err => {
          //alert('error');
        }
      )
    }
  }

  userLiked() {
    this.isLiked = true;
    this.likeCount++;
    this.UpdateComment();

  }
  handleStaticResultSelected(result) {
    //this.search = result;
    this.car = this.cars.filter(function (item) {
      return item.carName === result;
    })[0];
    this.car;
  }
}
