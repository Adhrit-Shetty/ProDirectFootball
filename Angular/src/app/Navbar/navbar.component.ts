import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../Shared/http.service';
import { AuthService } from '../Shared/auth.service';

declare var $: any;

@Component({
  selector: 'pdf-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  // Declaring variables
  myForm: FormGroup;
  request: any;
  valid: {response: string, check: boolean} ;
  logButton: string;
  loggedIn: boolean = false;
  cartContents: string = "";
  cart: any;
  admin: boolean;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ){
    auth.adminEmitted$.subscribe(
      (status) => {
        this.admin = status;
        console.log('Change in admin status' + this.admin);
      }
    );

    if (this.auth.checkCache()){
      if(this.auth.getCartContents() === 0){
        this.cartContents = "";
      }
      else {
        this.cartContents = JSON.stringify(this.auth.getCartContents());
      }
    }


    this.myForm = formBuilder.group({
      'username': ['',[Validators.required]],
      'password': ['',[Validators.required]],
      'rememberme': [false]
    });
    this.auth.changeEmitted$.subscribe(
      (event) => {
        if(event.type === 'cart') {
          this.cart = event.change;
          if (this.cart === 0) {
            this.cartContents = "";
          }
          else {
            this.cartContents = this.cart;
          }
        }
      });
    this.myForm.valueChanges.subscribe(data => console.log('Form changes', data));
    this.valid = {
      response: '',
      check: false
    };
  }

  ngOnInit() {
    this.auth.checkAdmin();
    if(this.auth.isLoggedIn()) {
      this.loggedIn = true;
      this.logButton = "Logout";
      console.log("LOGGED IN ALREADY BHAI");
      console.log(this.auth.isLoggedIn());
    }
    else {
      this.logButton = "Login";
    }
  }
  myOrders() {

  }

  onSubmit(data: any) {
    console.log("COMES HERE");
    this.request = {
      username: data.username,
      password: data.password
    };
    this.verifyUser(this.request);
  }

  verifyUser(request: any) {
    this.http.verifyUser(request)
      .subscribe(
        (data) => {
          console.log(data);
          if(data.message === "Already logged in") {
            console.log("Logged in");
            this.valid.check = false;
            this.valid.response = "Already Logged In!";
          }
          else
          if(data.message === "Unauthorized"){
            console.log("Unauthorized");
            this.valid.check = false;
            this.valid.response = "Wrong Username or Password!";
          }
          else
          if(data.message === "Unverified"){
            console.log("Unverified");
            this.valid.check = false;
            this.valid.response = "Unverified Account!";
          }
          else if (data.status === '2') {
            localStorage.setItem('admin', 'true');
            this.auth.checkAdmin();
            this.closeModal();
            console.log("ASDAD");
            this.valid.check = true;
            this.valid.response = "Valid User!";
            this.loggedIn = true;
            this.logButton = "Logout";
            this.auth.loggedIn({name: this.request.username, userdata: data});
            this.auth.emitChange('login','true');
          }
          else
          if (data.status === '1') {
            localStorage.setItem('admin', 'false');
            this.auth.checkAdmin();
            this.closeModal();
            console.log("ASDAD");
            this.valid.check = true;
            this.valid.response = "Valid User!";
            this.loggedIn = true;
            this.logButton = "Logout";
            this.auth.loggedIn({name: this.request.username, userdata: data});
            this.auth.emitChange('login','true');
          }
        }
      );
  }

  logout(){
    this.http.logOut(this.auth.getToken()).subscribe(
      (response) => {
        localStorage.setItem('admin', 'false');
        this.auth.checkAdmin();
        console.log(response);
        this.auth.loggedOut();
        this.loggedIn = false;
        this.logButton = "Login";
        this.myForm.reset();
        this.auth.emitChange('login','false');
        this.auth.navigateTo('/');
      }
    );
  }

  closeModal(){
    this.auth.closeModal();
  }
}
