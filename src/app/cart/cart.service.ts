import { Injectable } from "@angular/core";
import { Cart } from "./cart.model";
import { Account } from "../auth/account.model";
import { Product } from "../product/product.model";
import { ProductAndQuantity } from "../product/productAndQuantity.model";
import { Observable, of } from "rxjs";
import { ProductService } from "../product/product.service";

@Injectable({providedIn: "root"})
export class CartService {

    // public cart!: Cart;

    // constructor(private productService: ProductService){}

    // setCart(id: number, accountId: number, productsAndQuantity: ProductAndQuantity[]){
    //     this.cart.id = id;
    //     this.cart.account = accountId;
    //     this.cart.productsAndQuantity = productsAndQuantity;
    // }

    // getCart(): Cart{
    //     console.log(this.cart)
    //     return this.cart;
    // }

    // addToCart(productId: number){
    //     this.productService.addToCart(productId, this.cart.id);
        
    // }

}