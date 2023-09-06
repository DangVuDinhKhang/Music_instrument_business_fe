import { Component, OnInit } from '@angular/core';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{

  cart!: Cart;
  totalPrice: number = 0;

  constructor(private cartService: CartService, private authService: AuthService, private http: HttpClient){}

  ngOnInit(): void {
    this.handleCart()
      .then(() => {
        console.log(this.cart);
      })
      .catch(error => {
        console.error(error);
      });
    
  }

  // handleCart(){
  //   let list: any = [];
  //   this.http.get<Cart>(`http://localhost:8080/api/cart/account/${this.authService.accountIdAfterSuccess}`).subscribe((cart)=>{
  //       this.http.get<any>(`http://localhost:8080/api/product/cart/${cart.id}`).subscribe((productsAndQuantity)=>{
  //           this.http.get<any>(`http://localhost:8080/api/file`).subscribe((files)=>{
  //               for(let productAndQuantity of productsAndQuantity){
  //                   for(let file of files){
  //                   if(productAndQuantity.product.id == file.product.id){
  //                       let index = file.path.indexOf("assets");
  //                       let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
  //                       list.push(result);
  //                   }
  //                   }
  //                   productAndQuantity.file = list;
  //                   list = [];
  //               }
  //           })

  //           this.cart = new Cart(cart.id, productsAndQuantity, cart.account); 
  //       })
               
  //   })
  // }
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

}
