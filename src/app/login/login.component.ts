import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Login, LoginResponse } from './login.data';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router"

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUrl: string = "http://52.14.178.44:3000/api/Users/login";
  //loginUrl: string = "http://localhost:3000/api/Users/login";
  login: Login;
  loginResponse: LoginResponse;
  isValidFormSubmitted: boolean = false;
  message: string;

  constructor(private http: HttpClient, private router: Router) {
    this.login = new Login();
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
    let body = JSON.stringify(this.login);

    this.http.post(this.loginUrl, body, httpOptions).subscribe(
      (data) => {
        //this.loginResponse = data;
        data;
        this.router.navigate(['/app-cars']);
      },
      err => {
        if (err.status == 401) {
          this.message = "You have entered an invalid username or password";
        }
      }
    )
  }
  // register(){
  //   this.router.navigate(['register']);
  // }
}
LoginResponse
