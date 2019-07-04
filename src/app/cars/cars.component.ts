import { Component, OnInit } from '@angular/core';
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarsEntity, UserComment, UserNameWithComment } from './cars.data';
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
  userDetailsUrl = this.apiUrl + "Users/";

  car: CarsEntity;
  cars: Array<CarsEntity> = [];
  userComment: UserComment;
  userComments: Array<UserComment> = [];
  //comments: Array<string> = [];
  //userNameWithComment: UserNameWithComment;
  userNameWithComments: Array<UserNameWithComment> = [];
  inputComment: string;
  showCarDetail: boolean;
  isLiked: boolean = false;
  likeCount: number = 0;
  loginResponse: LoginResponse;
  currentUserNameFromCache: string;

  public staticList = [];
  public query = '';

  constructor(private http: HttpClient, private router: Router) {
    this.car = new CarsEntity();
    this.userComment = new UserComment();
  }

  ngOnInit() {
    this.loginResponse = JSON.parse(localStorage.getItem('loginResponse')) as LoginResponse;
    if (this.loginResponse == null || this.loginResponse == undefined) {
      this.router.navigate(['/login']);
    }
    this.currentUserNameFromCache = JSON.parse(localStorage.getItem('userName')) as string;
    this.getCars();
  }
  //This method loads on component initialization and loads all the cars details
  // When page loads we get user comment for 1st car as it wil default to load.
  getCars() {
    return this.http.get(this.carsUrl).subscribe(
      (data) => {
        this.cars = data as CarsEntity[];
        this.staticList = this.cars.map(function (a) { return a["carName"]; });
        this.car = this.cars[0];
        this.getUserComments(this.cars[0].id);
      }
    );
  }
  //This method gets 1 specific car details as when we change car we need to get values from DB
  getCar(id: string) {
    this.http.get(this.carUrl + id).subscribe(
      (data) => {
        this.car = data as CarsEntity;
        this.getUserComments(this.car.id);
      }
    )
  }
  //This method gets all the user comments details for a specific car
  getUserComments(carId: string) {
    //this.comments = [];
    this.userNameWithComments = [];
    this.likeCount = 0;
    this.isLiked = false;
    var carIdVal = { "where": { "carId": carId } };

    var url = this.userCommentUrl + "?filter=" + encodeURIComponent(JSON.stringify(carIdVal));
    this.http.get(url).subscribe(
      (data) => {
        this.userComments = data as UserComment[];
        // this.userComment = this.userComments[0] == null ? new UserComment() : this.userComments[0];
        var userName;
        this.userComments.forEach(element => {
          if (element.isLike) {
            this.likeCount++;
          }
          userName = element.username;
          element.comment.forEach(commentData => {
            //this.comments.push(commentData);
            var userNameWithComment = new UserNameWithComment();
            //if (commentData != '') {
              var commentToBeSplit = commentData.split('^')[0];
              var commentDate = commentData.split('^')[1];
              userNameWithComment.comment = commentToBeSplit; //commentData;
              userNameWithComment.username = userName;
              userNameWithComment.commentedDate = commentDate;
              this.userNameWithComments.unshift(userNameWithComment);
              //this.userNameWithComments.push(this.userNameWithComment);
            //}
          });
        });
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
    let updateItem = this.userComments.find(this.findIndexToUpdate, this.loginResponse.userId);
    let index = this.userComments.indexOf(updateItem);

    if (index >= 0) {
      this.UpdateComment();
    }
    else {
      this.InsertComment();
    }
  }

  private InsertComment() {
    var userComment = new UserComment();
    var commentedTime = new Date;
    userComment.userId = this.loginResponse.userId;
    userComment.carId = this.car.id;
    userComment.isLike = this.isLiked;
    userComment.username = this.currentUserNameFromCache;

    if (userComment.comment == undefined || userComment.comment == null) {
      userComment.comment = [];
    }
    userComment.comment.push(this.inputComment + "^" + commentedTime);

    let body = JSON.stringify(userComment);
    this.http.post(this.userCommentUrl, body, httpOptions).subscribe((data) => {
      var userNameWithComment = new UserNameWithComment();
      userNameWithComment.comment = this.inputComment;
      userNameWithComment.username = this.currentUserNameFromCache;
      userNameWithComment.commentedDate = commentedTime.toLocaleString();
      //this.userNameWithComments.push(userNameWithComment);
      //[userNameWithComment].concat(this.userNameWithComments);
      this.userNameWithComments.unshift(userNameWithComment);

      //This is required because we need userComments updated here so that we can check whether index>0 or not,
      //I mean whether it is an update or insert.
      this.userComments.push(userComment);

      this.inputComment = "";
      console.log('success');
    },
      err => {
        console.log('error');
      });
  }

  private UpdateComment() {
    this.userComment = this.userComments.find(this.findIndexToUpdate, this.loginResponse.userId);
    var commentedTime = new Date;

    //"id": this.userComment.id // we are not using this coz when user insert 1 comment we insert the record in
    // userComment list here without id and next time when user tries to insert 1 more comment, then we don't
    // have this id to update the respective field. In such cases we need to use carId and userId combination.

    var userData =
    {
      carId: this.userComment.carId,
      userId: this.userComment.userId
    };
    var userCommentUpdateUrl = this.apiUrl + "comments/update?where=" + encodeURIComponent(JSON.stringify(userData));

    this.userComment.comment.push(this.inputComment + "^" + commentedTime);

    let body = JSON.stringify(this.userComment);

    this.http.post(userCommentUpdateUrl, body, httpOptions).subscribe(
      (data) => {
        var userNameWithComment = new UserNameWithComment();
        userNameWithComment.comment = this.inputComment;
        userNameWithComment.username = this.currentUserNameFromCache;
        userNameWithComment.commentedDate = commentedTime.toLocaleString();
        //this.userNameWithComments.push(userNameWithComment);
        //[userNameWithComment].concat(this.userNameWithComments);
        this.userNameWithComments.unshift(userNameWithComment);

        //This is required because we need userComments updated here so that we can check whether index>0 or not,
        //I mean whether it is an update or insert.
        this.userComments.push(this.userComment);
        this.inputComment = "";
        console.log('success');
      },
      err => {
        console.log('error');
      }
    )
  }
  private InsertLike() {
    var userComment = new UserComment();
    userComment.userId = this.loginResponse.userId;
    userComment.carId = this.car.id;
    userComment.isLike = this.isLiked;
    userComment.username = this.currentUserNameFromCache;

    if (userComment.comment == undefined || userComment.comment == null) {
      userComment.comment = [];
    }
    // userComment.comment.push("");

    let body = JSON.stringify(userComment);
    this.http.post(this.userCommentUrl, body, httpOptions).subscribe((data) => {
      this.likeCount++;
      console.log('success');
      //This is required because we need userComments updated here so that we can check whether index>0 or not,
      //I mean whether it is an update or insert.
      this.userComments.push(userComment);
    },
      err => {
        console.log('error');
      });
  }
  private UpdateLike() {
    this.userComment = this.userComments.find(this.findIndexToUpdate, this.loginResponse.userId);
    //If user has already liked the post don't allow to update again.
    if (!this.userComment.isLike) {
      this.userComment.isLike = this.isLiked;

      var userData =
      {
        carId: this.userComment.carId,
        userId: this.userComment.userId
      };
      var userCommentUpdateUrl = this.apiUrl + "comments/update?where=" + encodeURIComponent(JSON.stringify(userData));

      let body = JSON.stringify(this.userComment);

      this.http.post(userCommentUpdateUrl, body, httpOptions).subscribe(
        (data) => {
          this.likeCount++;
          console.log('success');
        },
        err => {
          console.log('error');
        }
      )
    }
  }

  userLiked() {
    //When user clicks on like we trigger this method and set the flag
    this.isLiked = true;
    let updateItem = this.userComments.find(this.findIndexToUpdate, this.loginResponse.userId);
    let index = this.userComments.indexOf(updateItem);

    //Entity intialized as {}
    if (this.userComment == undefined || Object.entries(this.userComment).length === 0) {
      if (index < 0)
        this.InsertLike();
      else
        this.UpdateLike();
    }
    else {
      if (index < 0)
        this.InsertLike();
      else
        this.UpdateLike();
    }
  }

  handleStaticResultSelected(result) {
    //this.search = result;
    this.car = this.cars.filter(function (item) {
      return item.carName === result;
    })[0];
    this.car;
  }
}
