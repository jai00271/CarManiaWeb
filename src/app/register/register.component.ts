import { Component, OnInit } from '@angular/core';
import { Register, RegisterResponse } from './register.data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  apiUrl = environment.apiUrl;

  registerUrl: string = this.apiUrl + "Users";
  //registerUrl: string = "http://52.14.178.44:3000/api/Users";
  //registerUrl: string = "http://localhost:3000/api/Users";
  register: Register;
  isValidFormSubmitted: boolean = false;
  registerResponse: RegisterResponse;
  message: string;

  constructor(private http: HttpClient, private router: Router) {
    this.register = new Register();
    this.registerResponse = new RegisterResponse();
    localStorage.clear();
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
    this.register.emailVerified = true;
    let body = JSON.stringify(this.register);

    this.http.post(this.registerUrl, body, httpOptions).subscribe(
      (data) => {
        this.registerResponse = data as RegisterResponse;
        this.router.navigate(['/login']);
      },
      err => {
        if (err.status == 422) {
          this.message = err.error.error.message;
        }
      }
    )
  }
}
