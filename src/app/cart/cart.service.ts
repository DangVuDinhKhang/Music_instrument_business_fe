import { Injectable } from "@angular/core";
import { Cart } from "./cart.model";
import { Account } from "../auth/account.model";
import { Product } from "../product/product.model";
import { ProductAndQuantity } from "../product/productAndQuantity.model";
import { Observable, of } from "rxjs";

@Injectable({providedIn: "root"})
export class CartService {

    // public cart: Cart = new Cart();

    // setCart(id: number, accountId: number, productsAndQuantity: ProductAndQuantity[]){
    //     this.cart.id = id;
    //     this.cart.account = accountId;
    //     this.cart.productsAndQuantity = productsAndQuantity;
    //     console.log(this.cart)
    // }

    // getCart(): Cart{
    //     console.log(this.cart)
    //     return this.cart;
    // }

    // clearCart(){
    //     // this.cart = new Cart();
    // }

}