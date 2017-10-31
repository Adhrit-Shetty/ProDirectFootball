import { Component, OnInit } from '@angular/core';
import {Boot, BootOrder} from '../Shared/boot.model';
import {AuthService} from '../Shared/auth.service';
import {HttpService} from '../Shared/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { CanComponentDeactivate } from "../Shared/paymentDeactivate.guard";
import swal from 'sweetalert2';

@Component({
  selector: 'pdf-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, CanComponentDeactivate {
  no_of_orders: number = 0;
  totalamount: number = 0;
  isCartEmpty: boolean = false;
  boots: Boot[] = [];
  bootsQuantity: number[] = [];
  cart: any;
  flag: any = -1;
  myForm: FormGroup;
  myOtp: FormGroup;
  request: any;
  valid: {response: string, check: string, type: string};
  cancelPayment: boolean = false;

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) {
    if(!this.auth.checkCache()) {
      this.isCartEmpty = true;
    }
    else {
      this.cart = this.auth.getCart();
      this.boots = this.cart.boots;
      this.bootsQuantity = this.cart.quantity;
      this.no_of_orders = this.boots.length;
    }
    this.total();
    this.myForm = formBuilder.group({
      'card_num': ['',[Validators.required]],
      'month': ['',[Validators.required]],
      'year': ['',[Validators.required]],
      'cvv': ['',[Validators.required]]
    });
    this.myOtp = formBuilder.group({
      'otp_num': ['',[Validators.required]]
    });
    this.auth.changeEmitted$.subscribe(
      (event) => {
        if(event.type === 'login') {
          if(!this.auth.bool(event.change)) {
            this.auth.openModal();
            this.auth.navigateTo('basket');
          }
        }
      }
    );
    this.valid = {
      response: '',
      check: '',
      type: ''

    };
  }

  ngOnInit() {
  }

  onSubmit(data: any, flag: any) {
    if (flag !== 1) {
    } else {
      this.request = {
        otp: data.otp_num,
      };
      this.verifyOtp(this.request);
    }
  }

  generateOtp() {
    this.http.generateOtpPayment()
      .subscribe(
        (data) => {
          this.valid = {
            response: 'OTP has been sent to your registered Mobile Number!',
            check: 'otp',
            type: 'success'
          };
          console.log(this.valid);
        }
      );
  }

  verifyOtp(otp: any) {
    this.http.verifyOtpPayment({otp: otp.otp, total: this.totalamount})
      .subscribe(
        (data) => {
          if(data === 'Successful Transaction!') {
            console.log("Successful");
            this.auth.removeUser();
            this.http.completePurchase({data: this.auth.getOrders()})
              .subscribe(
                (data) => {
                  if(data === 'order placed!') {
                    this.valid = {
                      response: 'Transaction has been Successful!',
                      check: 'otp',
                      type: 'success'
                    };
                    this.auth.emptyCart();
                    setTimeout(
                      () => {
                        this.cancelPayment = true;
                        this.auth.navigateTo('home');
                      },
                      1500
                    );
                  }
                }
              );
          } else {
            this.valid = {
              response: 'OTP match failed. Re-enter the correct OTP please!',
              check: 'otp',
              type: 'danger'
            };
            this.myOtp.reset();
          }
        }
      );
  }

  total() {
    this.totalamount = 0;
    for(let i in this.boots) {
      this.totalamount += ((+this.boots[i].price)*(+this.bootsQuantity[i]));
    }
  }

  routeToHome() {
    let query: any = [];
    for(let i in this.boots) {
      query.push(new BootOrder(this.boots[i].name, this.bootsQuantity[i]).json());
    }
    console.log('ROUTING TO HOME');
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancel Payment!'
    }).then(() => {
        this.cancelPayment = true;
        this.http.releaseCart(query)
          .subscribe(
            (data) => {
              this.auth.navigateTo('home');
            }
          );
    }).catch(
      (dismiss) => {
        if(dismiss !== 'cancel') {
          console.log(dismiss);
          this.routeToHome();
        }
      }
    );
  }

  removeBoot(i) {
    this.boots.splice(i,1);
    this.bootsQuantity.splice(i,1);
    this.auth.removeFromCart(this.boots,this.bootsQuantity);
    this.total();
    if(!this.auth.checkCache()) {
      this.isCartEmpty = true;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if(!this.auth.isLoggedIn() || this.cancelPayment) {
      return true;
    }
  }
}
