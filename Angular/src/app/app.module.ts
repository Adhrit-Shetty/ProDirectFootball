import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { NavbarComponent } from './Navbar/navbar.component';
import { HomeComponent } from './Home/home.component';
import { AuthService } from './Shared/auth.service';
import {ActivateAdmin, PaymentActivateGuard} from './Shared/paymentActivate.guard';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterModule } from '@angular/router';
import { HttpService } from './Shared/http.service';
import { ProductComponent } from './Product/product.component';
import { ROUTES } from './app.routing';
import { TerminalComponent } from './Terminal/terminal.component';
import { BasketComponent } from './BasketPage/basket.component';
import { RegisterpComponent } from './Register/registerp.component';
import { PaymentComponent } from './PaymentPage/payment.component';
import { PrivacyComponent } from './FooterPages/privacy.component';
import { ContactusComponent } from './FooterPages/contactus.component';
import { TandcComponent } from './FooterPages/tandc.component';
import { PaymentDeactivateGuard } from './Shared/paymentDeactivate.guard';
import { OrdersComponent } from './MyOrders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductComponent,
    TerminalComponent,
    BasketComponent,
    RegisterpComponent,
    PaymentComponent,
    PrivacyComponent,
    ContactusComponent,
    TandcComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ROUTES,
    RouterModule,
    ChartsModule,
    ReactiveFormsModule,
    LocalStorageModule.withConfig({
      prefix: 'pdf-app',
      storageType: 'localStorage'
    })
  ],
  providers: [
    AuthService,
    PaymentActivateGuard,
    PaymentDeactivateGuard,
    ActivateAdmin,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
