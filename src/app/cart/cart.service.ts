import { Injectable } from "@angular/core";
import { Cart } from "./cart.model";
import { Account } from "../auth/account.model";
import { Product } from "../product/product.model";
import { ProductAndQuantity } from "../product/productAndQuantity.model";
import { Observable, of } from "rxjs";
import { ProductService } from "../product/product.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: "root"})
export class CartService {

    // public numberOfType = 0;
    

    // constructor(private http: HttpClient, private authService: AuthService){}
 
    // async handleCart(): Promise<void> {
    //     const cart = await this.http.get<any>(`http://localhost:8080/api/cart/account/${this.authService.accountIdAfterSuccess}`).toPromise();
    //     if(cart){
    //         const productsAndQuantity = await this.http.get<any>(`http://localhost:8080/api/product/cart/${cart.id}`).toPromise();
    //         this.numberOfType = productsAndQuantity.length;
    //      }
    // }


}