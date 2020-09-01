import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private route: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      // tslint:disable-next-line: member-ordering
      const isAuth = this.authService.getIsAuthenticated();
      if (!isAuth) {
        this.route.navigate(['/login']);
      }
    // tslint:disable-next-line: align
    return isAuth;
  }

}
