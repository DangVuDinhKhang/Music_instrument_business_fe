import { Injectable } from "@angular/core";
import { Cart } from "./cart.model";
import { Account } from "../auth/account.model";
import { Product } from "../product/product.model";

@Injectable({providedIn: "root"})
export class CartService {

    public cart: Cart = new Cart();

    setCart(id: number, amount: number, accountId: number, products: Product[]){
        this.cart.id = id;
        this.cart.amount = amount;
        this.cart.account = accountId;
        this.cart.products = products;
    }

    getCart(): Cart{
        return this.cart;
    }

    clearCart(){
        this.cart = new Cart();
    }

}