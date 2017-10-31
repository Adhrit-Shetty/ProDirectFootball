import { Component, OnInit } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { Boot, BootOrder } from "../Shared/boot.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { bootStateTrigger } from "../Shared/boot.animations";
import swal from 'sweetalert2';

@Component({
  selector: 'pdf-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  animations: [
    bootStateTrigger
  ]
})

export class TerminalComponent implements OnInit {
  // Declaring variables
  myForm: FormGroup;
  myComment: FormGroup;
  bootLoaded: boolean = false;
  query: any;
  id: string;
  brand: string;
  desc: string;
  name: string;
  collection: string;
  imgthumb: string;
  img1src: string;
  img2src: string;
  img3src: string;
  price: string;
  status: string;
  quantity: number = 0;
  boot: Boot;
  b_rating: number;
  b_comment: string;

  constructor (
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.myForm = formBuilder.group({
      'quantity': [1, [Validators.required]]
    });
    this.myComment = formBuilder.group({
      'comment': ['', [Validators.required]],
      'rating': ['', [Validators.required]]
    });
    this.id = this.auth.getBootID();
    console.log('THE ID'+this.id);
    this.query = {
      "_id": this.id
    };
    this.http.fetchBoot(this.query)
      .subscribe(
        (data) => {
          let boot = data.result;
          console.log(boot);
          this.brand = boot.brand;
          this.name = boot.bname;
          this.collection = boot.coll;
          this.price = boot.saleprice;
          this.desc = boot.description;
          for(let i in boot.image) {
            switch( i ){
              case '0' :
                this.imgthumb = boot.image[i].data;
                break;
              case '1' :
                this.img1src = boot.image[i].data;
                break;
              case '2' :
                this.img2src = boot.image[i].data;
                break;
              case '3' :
                this.img3src = boot.image[i].data;
            }
          }
          this.bootLoaded = true;
          const request: any = {
            bname: this.name
          };
          this.http.getComment(request)
            .subscribe(
              (result) => {
                console.log(result);
                this.b_comment = result.comment;
                this.b_rating = result.rating;
              }
            );
        }
      );
  }

  ngOnInit() {}

  onSubmit(data: any, flag: any) {
    if (flag === -1) {
      this.quantity = data.quantity;
      this.boot = new Boot(
        this.id,
        this.brand,
        this.name,
        this.collection,
        this.imgthumb,
        this.price,
        this.status
      );
      console.log(this.quantity);
      console.log(this.boot);
      this.http.verifyStock([new BootOrder(this.boot.name, this.quantity).json()])
        .subscribe(
          (res) => {
            if (res.status === '1') {
              console.log('Success');
              swal({
                type: 'success',
                title: 'Added to Cart!',
                showConfirmButton: false,
                timer: 1500
              }).catch((dismiss) => {
                  console.log(dismiss);
                  this.auth.addToCart(this.boot,this.quantity);
                });
            } else {
              console.log('Fail');
              swal(
                'Oops!',
                'Only '+res.data[0].stock+' boots available!',
                'error'
              ).catch(swal.noop);
            }
          }
        );
    } else {
      let request: any;
      request = {
        bname: this.name,
        remarks: data.comment,
        rating: data.rating
      };
      console.log(request);
      this.http.sendComment(request)
        .subscribe(
          (result) => {
            console.log(result);
            if (result.status === '1') {
              alert('Comment Submitted! Thank you for the review.');
            } else {
              alert('Boot has not been purchased by user! ');
            }
          }
        );
    }
  }
}
