import { Injectable } from '@angular/core';

import { Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class AuthService {
  
  constructor(
    private router: Router,
    private local: LocalStorageService
  ) {}
  
  /*---> USER RELATED STORAGE SERVICES <---*/
  //Declaring user service variables
  log: boolean = false;
  name: string;
  token: any;
  isLoggedIn() {
    console.log("CHECKING");
    return this.bool(localStorage.getItem('log'));
  }
  
  loggedIn(data: any) {
    console.log("LOGGED IN");
    this.storeLocally(data);
    this.name = data.userdata.username;
    this.token = data.userdata.token;
    this.log = true;
  }
  
  storeLocally(data: any) {
    localStorage.setItem('name',data.userdata.username);
    localStorage.setItem('token',data.userdata.token);
    localStorage.setItem('log','true');
  }
  
  bool(str: string): boolean {
    if(str === 'true')
      return true;
    else
    if(str === 'false')
      return false;
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
  
  loggedOut() {
    localStorage.setItem('log','false');
    this.log = false;
    this.clear();
  }
  
  clear() {
    console.log("REMOVING");
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    console.log(localStorage);
  }
  
  /*---> BOOT RELATED STORAGE SERVICES <---*/
  //Declaring boot service variables
  bootid: string;
  
  fetchBoot(id){
    this.bootid = id;
    this.navigateTo("terminal");
  }
  
  getBootID(){
    return this.bootid;
  }
  
  navigateTo(url: string) {
    console.log("ZABARDASTI");
    this.router.navigate(['./'+url]);
  }
}
