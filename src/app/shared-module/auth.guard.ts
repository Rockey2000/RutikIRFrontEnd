import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppModuleConstants } from '../app-constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router : Router){

  }
  canActivate( route : ActivatedRouteSnapshot, state: RouterStateSnapshot): any{
    let user = sessionStorage.getItem(AppModuleConstants.USER);
    let role = sessionStorage.getItem(AppModuleConstants.ROLE);
    if(role==='1'){
      return true;
    }   
    else if(role === '2'){
       return false;

    }
    else if (role ==='3'){
      return false;
    }
  
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
