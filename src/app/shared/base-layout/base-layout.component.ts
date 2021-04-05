/*============================================;
Title: Sprint 1 - Nodebucket;
Author: Professor Krasso;
Date: 3/20/2021;
Modified By: Jonathan Roland;
Description: This application provides a TODO list to users to track work or study items.
===========================================*/

//This file provides the base layout component.

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();

  constructor(private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
  }
//This function provides logout functionality. It destroys the session and routes the user to the login page.
  logout(){
    console.log('Logout function called');
    // The deleteAll() function was found to be more reliable than delete() for deleting the user's session.
    // If this application was being used in a true multi-user environment, deleteAll() presents a danger of unexpected consequences.
    // A more precise deletion of the specific user session would be better for that case.
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }

}
