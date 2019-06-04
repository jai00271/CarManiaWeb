import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxTypeaheadModule } from 'ngx-typeahead';

import { AppComponent } from './app.component';
import { CarsComponent } from './cars/cars.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CreateCarsManiaComponent } from './create-cars-mania/create-cars-mania.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    CarsComponent,
    LoginComponent,
    CreateCarsManiaComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxTypeaheadModule,
    RouterModule.forRoot([
      //{ path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'cars', component: CarsComponent },
      { path: 'createcars', component: CreateCarsManiaComponent },
      { path: '**', redirectTo: 'login' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
