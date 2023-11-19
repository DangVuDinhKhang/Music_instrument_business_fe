import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Payment } from '../manage-payment/payment.model';
import { Subscription } from 'rxjs';
import { Account } from '../auth/account.model';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { NgForm } from '@angular/forms';
import { Cart } from '../cart/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.scss']
})
export class FormOrderComponent implements OnInit, OnDestroy{

  payments!: Payment[];
  selectedPayment: Payment = new Payment(0, '');
  private userSub!: Subscription;
  isAuthenticated = false;
  phone!: string;
  address!: string;
  accountId!: number;
  cart!: Cart;
  totalPrice!: number;


  constructor(private authService: AuthService, private cartService: CartService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.getPayments()
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.accountId = account.id;
        this.phone = account.phone;
        this.address = account.address;
      }
    })
    this.handleCart().then(()=>{
      this.updateTotalPrice()
    })
    .catch(error=>
      console.error(error)
    )
    
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;

    const phone = form.value.phone;
    const address = form.value.address;
    const note = form.value.note;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });

    let url = `http://localhost:8080/api/order/`;
    
    this.http.post<any>(url, {
      phone: phone, 
      address: address, 
      note: note,
      total: this.totalPrice,
      account: {id: this.accountId},
      payment: {id: this.selectedPayment.id},
      productsInCartDTO: this.cart.productsAndQuantity
    }, {headers}).subscribe((responseData)=>{
      if(responseData.url){
        window.location = responseData.url;
      }
      else{
        this.router.navigate(["/my-order"]);
      }
      
    });
  }
    

  updateTotalPrice(){
    this.totalPrice = 0;
    for(let productAndQuantity of this.cart.productsAndQuantity){
      this.totalPrice += productAndQuantity.quantity * productAndQuantity.product.price;
    }
  }

  getPayments(){
    this.http.get<Payment[]>(`http://localhost:8080/api/payment`).subscribe((payments)=>{
      this.payments = payments;
    })
  }

  onSelected(payment: Payment){
    this.selectedPayment = payment;
  }

  async handleCart(): Promise<void> {
    let list: any = [];
    const cart = await this.http.get<any>(`http://localhost:8080/api/cart/account/${this.authService.accountIdAfterSuccess}`).toPromise();
    if(cart){
      const productsAndQuantity = await this.http.get<any>(`http://localhost:8080/api/product/cart/${cart.id}`).toPromise();
      const files = await this.http.get<any>(`http://localhost:8080/api/file`).toPromise();
      if(files){
        for (let productAndQuantity of productsAndQuantity) {
          for (let file of files) {
            if (productAndQuantity.product.id == file.product.id) {
              let index = file.path.indexOf("assets");
              let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
              list.push(result);
            }
          }
          productAndQuantity.product.file = list;
          list = [];
        }
        this.cart = new Cart(cart.id, productsAndQuantity, cart.account.id);
      }
    }
  }

  
  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
