/*============================================;
Title: Sprint 1 - Nodebucket;
Author: Professor Krasso;
Date: 3/20/2021;
Modified By: Jonathan Roland;
Description: This application provides a TODO list to users to track work or study items.
===========================================*/

//This file provides an AuthGuard to prevent invalid access.

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService){

  }
// The canActivate functions looks for a cookie set by the current session user.
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const sessionUser = this.cookieService.get('session_user');
      // The boolean return filter tells the calling code if the user is logged in. If not, it goes ahead and routes the user to the login page.
    if(sessionUser)
    {
      return true;
    }
    else
    {
      this.router.navigate(['/session/login']);
      return false;
    }
  }

}
