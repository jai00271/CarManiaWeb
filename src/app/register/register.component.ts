import { Component, OnInit } from '@angular/core';
import { Register } from './register.data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUrl: string = "http://localhost:3000/api/Users";
  register: Register;
  isValidFormSubmitted: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.register = new Register();
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
    this.register.emailVerified = true;
    let body = JSON.stringify(this.register);

    this.http.post(this.registerUrl,body, httpOptions).subscribe(
      (data)=>{
        this.router.navigate(['/app-cars']);
      }
    )
  }
}
