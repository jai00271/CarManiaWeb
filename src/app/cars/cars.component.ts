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

  apiUrl = environment.apiUrl;
  carsUrl = this.apiUrl + "carsmania";
  carUrl = this.apiUrl + "carsmania/";
  userCommentUrl = this.apiUrl + "comments";

  userCommentUpdateUrl: string;
  car: CarsEntity;
  cars: Array<CarsEntity> = [];
  userComment: UserComment;
  userComments: Array<UserComment> = [];
  comments: Array<string> = [];
  inputComment: string;
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
      }
    );
    this.getUserComments().subscribe(
      (data) => {
        this.userComments = data as UserComment[];
        // this.userComment = this.userComments[0] == null ? new UserComment() : this.userComments[0];
        this.userComments.forEach(element => {
          if (element.isLike) {
            this.likeCount++;
          }
          element.comment.forEach(commentData => {
            this.comments.push(commentData);
          });
        });
      }
    );
  }

  getCars() {
    return this.http.get(this.carsUrl);
  }

  getUserComments() {
    return this.http.get(this.userCommentUrl);
  }

  getCar(id: string) {
    this.http.get(this.carUrl + id).subscribe(
      (data) => {
        this.car = data as CarsEntity;
        //this.LoadComments();
      }
    )
  }
  submit() {
    this.Save();
  }

  findIndexToUpdate(newItem) {
    return newItem.userId === this;
  }
  Save() {
    let loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;

    let updateItem = this.userComments.find(this.findIndexToUpdate, loginResponse.userId);
    let index = this.userComments.indexOf(updateItem);

    if (index >= 0) {
      this.UpdateComment();
    }
    else {

      this.userComment.userId = loginResponse.userId;
      this.userComment.carId = this.car.id;
      this.userComment.isLike = this.isLiked == null ? false : true;

      //var temp_comment = JSON.stringify(this.userComment.comment);
      if (this.userComment.comment == undefined || this.userComment.comment == null) {
        this.userComment.comment = [];
      }
      this.userComment.comment.push(this.inputComment);

      this.userComments.push(this.userComment);
      let body = this.userComments;

      this.http.post(this.userCommentUrl, body, httpOptions).subscribe(
        (data) => {
          alert('success');
        },
        err => {
          alert('error');
        }
      )
    }
  }
  private UpdateComment() {
    let loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;

    this.userComment = this.userComments.find(this.findIndexToUpdate, loginResponse.userId);

    var userData =
    {
      "id": this.userComment.id
    };
    this.userCommentUpdateUrl = this.apiUrl + "comments/update?where=" + encodeURIComponent(JSON.stringify(userData));

    this.userComment.comment.push(this.inputComment);

    let body = JSON.stringify(this.userComment);

    this.http.post(this.userCommentUpdateUrl, body, httpOptions).subscribe(
      (data) => {
        this.comments.push(this.inputComment);
        this.inputComment = "";
        alert('success');
      },
      err => {
        alert('error');
      }
    )
  }

  private UpdateLike() {
    let loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;

    this.userComment = this.userComments.find(this.findIndexToUpdate, loginResponse.userId);
    if (!this.userComment.isLike) {
      this.userComment.isLike = this.isLiked;

      var userData =
      {
        "id": this.userComment.id
      };
      this.userCommentUpdateUrl = this.apiUrl + "comments/update?where=" + encodeURIComponent(JSON.stringify(userData));

      let body = JSON.stringify(this.userComment);

      this.http.post(this.userCommentUpdateUrl, body, httpOptions).subscribe(
        (data) => {
          this.likeCount++;
          alert('success');
        },
        err => {
          alert('error');
        }
      )
    }
  }

  userLiked() {
    this.isLiked = true;
    this.UpdateLike();
  }

  handleStaticResultSelected(result) {
    //this.search = result;
    this.car = this.cars.filter(function (item) {
      return item.carName === result;
    })[0];
    this.car;
  }
}
