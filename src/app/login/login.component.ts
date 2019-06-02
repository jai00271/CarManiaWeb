import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Login } from './login.data';
import { NgForm } from '@angular/forms';
import {Router} from "@angular/router"

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  SaveUrl: string = "http://localhost:3000/api/Users";
  login: Login;
  isValidFormSubmitted: boolean = false;

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
  Save(){
    this.login.emailVerified = true;
    this.login.username = this.login.email;
    let body = JSON.stringify(this.login);

    this.http.post(this.SaveUrl,body, httpOptions).subscribe(
      (data)=>{
        this.router.navigate(['/app-cars']);
      }
    )
  }
}
