import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { MatPaginatorModule , MatSort, MatPaginator, MatTableDataSource, MatMenuModule,  MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';

import { AppComponent } from './app.component';
import { CarsComponent } from './cars/cars.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CreateCarsManiaComponent } from './create-cars-mania/create-cars-mania.component';
import { RegisterComponent } from './register/register.component';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogBoxComponent } from './create-cars-mania/dialog-box/dialog-box.component';

@NgModule({
  declarations: [
    AppComponent,
    CarsComponent,
    LoginComponent,
    CreateCarsManiaComponent,
    RegisterComponent,
    DialogBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    NgxTypeaheadModule,
    DataTablesModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    RouterModule.forRoot([
      //{ path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'cars', component: CarsComponent },
      { path: 'createcars', component: CreateCarsManiaComponent },
      { path: '**', redirectTo: 'login' }
    ]),
    BrowserAnimationsModule
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
