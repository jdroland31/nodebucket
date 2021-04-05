/*============================================;
Title: Sprint 1 - Nodebucket;
Author: Professor Krasso;
Date: 3/20/2021;
Modified By: Jonathan Roland;
Description: This application provides a TODO list to users to track work or study items.
===========================================*/

//This file provides the login component.

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,private router: Router, private cookieService: CookieService, private http: HttpClient, private snackBar: MatSnackBar) { }

  loginForm: FormGroup;
  errorMessage: string;

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      empId: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]*$')])]
    });
  }
//The login function provides the logic for handling login attempts.
  login(){
    const empId = this.loginForm.controls['empId'].value;
    this.http.get('/api/employees/' + empId).subscribe(res => {
      if(res['data'])//If the result returns an attribute named 'data' we can set the user's session cookie and navigate to the home route.
      {
        this.cookieService.set('session_user', empId, 1);
        this.router.navigate(['/']);
      }
      else if(!(res['data']) && (res['httpCode'] === '200')) //If we do not get user data but return a 200 code, we have an invalid ID and should alert the user.
      {
        this.openSnackBar('Invalid employeeId, please try again', 'WARNING');
      }
      else{//A result which returns an error is displayed.
        this.openSnackBar(res['message'], 'ERROR');
      }
    })
  }

//This function simply sets the standards used by the snackbar when called.
  openSnackBar(message: string, notificationType: string) : void
  {
    this.snackBar.open(message, notificationType, {
      duration: 3000,
      verticalPosition: 'top'
    })
  }

}
