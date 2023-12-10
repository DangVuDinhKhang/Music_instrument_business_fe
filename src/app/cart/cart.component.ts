import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../product/product.service';
import { ProductAndQuantity } from '../product/productAndQuantity.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{

  cart!: Cart;
  totalPrice: number = 0;

  @ViewChild("deleteModal") deleteModal: any;
  
  needToRemove = 0;

  constructor(
    private cartService: CartService, private authService: AuthService,private modalService: NgbModal, 
    private http: HttpClient, private productService: ProductService
  ){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.handleCart()
      .then(() => {
        this.updateTotalPrice();
      })
      .catch(error => {
        console.error(error);
      });
  }

  open(modal: any, productId: any){
    
    this.modalService.open(modal);
    this.needToRemove = productId;
  }

  updateTotalPrice(){
    this.totalPrice = 0;
    for(let productAndQuantity of this.cart.productsAndQuantity){
      this.totalPrice += productAndQuantity.quantity * productAndQuantity.product.price;
    }
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

  addToCart(productId: number){
    // this.productService.addToCart(productId, this.cart.id);
    // for(let productAndQuantity of this.cart.productsAndQuantity){
    //   if(productAndQuantity.product.id == productId)
    //       productAndQuantity.quantity += 1;
    // }
    // this.updateTotalPrice();
    this.http.put<any>(`http://localhost:8080/api/product/add-to-cart`, {productId: productId, cartId: this.cart.id, quantity: 1}).subscribe(
      (responseData)=>{
        for(let productAndQuantity of this.cart.productsAndQuantity){
            if(productAndQuantity.product.id == productId)
                productAndQuantity.quantity += 1;
        }
        this.updateTotalPrice();
      },
      (error)=>{
        console.error('Lỗi:', error);
      }
    );
  }

  updateInCart(productId: number){
    let checkBefore = true;
    for(let productAndQuantity of this.cart.productsAndQuantity)
      if(productAndQuantity.product.id === productId && productAndQuantity.quantity - 1 == 0){
        checkBefore = false;
        this.open(this.deleteModal, productId);
      }
    if(checkBefore){
      this.productService.updateInCart(productId, this.cart.id, 1);
      this.cart.productsAndQuantity = this.cart.productsAndQuantity.filter(productAndQuantity => {
        if (productAndQuantity.product.id === productId) {
          if (productAndQuantity.quantity - 1 > 0) {
            productAndQuantity.quantity -= 1;
            return true; // Giữ lại phần tử này
          }
          // Không giữ lại phần tử này
          return false;
        }
        return true; // Giữ lại các phần tử khác
      });
      this.updateTotalPrice();
    }
  }

  isInteger(value: number) {
    return (typeof value === 'number') && ((value % 1) === 0);
  }

  updateInCartWithInput(productId: number, quantity: number) {
    quantity = Number(quantity);
    if(quantity <= 0 || !this.isInteger(quantity)) {
      for(let productAndQuantity of this.cart.productsAndQuantity){
        if(productAndQuantity.product.id == productId){
          productAndQuantity.quantity = 1;
        }
      }
    }
    else{
      this.productService.updateInCartWithInput(productId, this.cart.id, quantity).subscribe(
        (responseData) => {
          for(let productAndQuantity of this.cart.productsAndQuantity){
            if(productAndQuantity.product.id == productId)
                productAndQuantity.quantity = quantity;
          }
          this.updateTotalPrice();
        },
        (error) => {
          for(let productAndQuantity of this.cart.productsAndQuantity){
            if(productAndQuantity.product.id == productId)
                productAndQuantity.quantity = 1;
          }
          console.error('Error in updating product in cart:', error);
          
        }
      );
      
    }
    
    
  }

  removeFromCart(){
    this.productService.removeFromCart(this.needToRemove, this.cart.id);
    this.cart.productsAndQuantity = this.cart.productsAndQuantity.filter(
      productAndQuantity => productAndQuantity.product.id != this.needToRemove
    )
    this.updateTotalPrice();
    this.modalService.dismissAll()
  }
}
