import { Component, OnInit } from '@angular/core';
import { HttpService } from '../Shared/http.service';
import { Boot } from "../Shared/boot.model";
import { AuthService } from "../Shared/auth.service";

@Component({
  selector: 'pdf-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ HttpService ]
})
export class ProductComponent implements OnInit {
  img: any;
  brand_logo: string = `puma`;
  collection: string = `<strong>COPA</strong>`;
  imgsrc: string = `../../assets/images/productImages/thumbs/144664.jpg`;
  overlayclass: string = `new`;
  overlaytext: string = `New`;
  bootname: string = `them boots`;
  bootprice: string = `200`;
  brands: string[] = [];
  collections: string[] = [];
  boots: Boot[] = [];
  prices: string[] = ['0-100','100-200','200-300'];
  isBrandSelected: boolean[] = [];
  isCollectionSelected: boolean[] = [];
  isPriceSelected: boolean[] = [false,false,false];
  
  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {
    this.http.startBoots()
      .subscribe(
        (x) => {
          console.log (x);
          for(let brand of x.brand) {
            this.brands.push(brand);
            this.isBrandSelected.push(false);
          }
          for(let collection of x.collection) {
            this.collections.push(collection);
            this.isCollectionSelected.push(false);
          }
          for(let boot of x.data) {
            this.boots.push(new Boot(
              boot._id,
              boot.brand,
              boot.bname,
              boot.coll,
              boot.image[0].data,
              boot.saleprice,
              ''
            ));
          }
        }
      );
  }
  ngOnInit() {
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        }
        else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }
  
  toggleBrand(i) {
    if(this.isBrandSelected[i]){
      this.isBrandSelected[i] = false;
    }
    else {
      this.isBrandSelected[i] = true;
    }
  }
  
  toggleCollection(i) {
    if(this.isCollectionSelected[i]){
      this.isCollectionSelected[i] = false;
    }
    else {
      this.isCollectionSelected[i] = true;
    }
  }
  
  fetchBoot(i){
    console.log("FETCH BOOT" + this.boots[i].id);
    this.auth.fetchBoot(this.boots[i].id);
  }
}
