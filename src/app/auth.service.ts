import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { AuthModel } from './auth-model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private route: Router) { }
  private token: string;
  private isAuthenticated = false;
  private userStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthModel = { email, password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(() => {
      this.route.navigate(['/']);
    }, error => {
      this.userStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthModel = { email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setTokenTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId,
        this.userStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveTokenData(token, expirationDate, this.userId);
        this.route.navigate(['/']);
      }
    //  console.log(response);
    }, error => {
      this.userStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getTokenData();
    if (!authInformation) {
      return;
    }
    const now =  new Date();
    const expireDiff = authInformation.expirationDate.getTime() - now.getTime() ;

    if (expireDiff > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setTokenTimer(expireDiff / 1000);
      this.userStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearTokenData();
    this.route.navigate(['/']);
  }

  private setTokenTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveTokenData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearTokenData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getTokenData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
