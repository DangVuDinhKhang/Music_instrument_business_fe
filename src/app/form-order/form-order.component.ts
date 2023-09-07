import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Payment } from '../manage-payment/payment.model';
import { Subscription } from 'rxjs';
import { Account } from '../auth/account.model';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.scss']
})
export class FormOrderComponent implements OnInit, OnDestroy{

  payments!: Payment[];
  selectedPayment: number = 0;
  private userSub!: Subscription;
  isAuthenticated = false;
  phone!: string;
  address!: string;


  constructor(private authService: AuthService, private cartService: CartService, private http: HttpClient){}

  ngOnInit(): void {
    this.getPayments()
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.phone = account.phone;
        this.address = account.address;
        console.log(this.phone)
      }
    })
    
  }

  onSubmit(form: NgForm){

  }

  getPayments(){
    this.http.get<Payment[]>(`http://localhost:8080/api/payment`).subscribe((payments)=>{
      this.payments = payments;
    })
  }

  onSelected(paymentId: number){
    this.selectedPayment = paymentId;
    console.log(this.selectedPayment);
  }

  
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
