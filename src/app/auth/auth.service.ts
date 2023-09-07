import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { Account } from "./account.model";
import { Router } from "@angular/router";
import { Cart } from "../cart/cart.model";
import { CartService } from "../cart/cart.service";
import { Product } from "../product/product.model";
import { ProductAndQuantity } from "../product/productAndQuantity.model";

export interface AuthResponseData {
    id: number
    username: string
    role: string
    cart: Cart
    token: string
}

@Injectable({providedIn: "root"})
export class AuthService{
    account = new BehaviorSubject<Account>(null!);
    private tokenExpirationTimer: any;
    accountIdAfterSuccess!: number
    
    constructor(private http: HttpClient, private router: Router, private cartService: CartService){}

    signUp(username: string, password: string) {
        return this.http.post<AuthResponseData>("http://localhost:8080/api/account/register", {
            username: username,
            password: password
        }).pipe(catchError(this.handleError), tap((response)=>{
            this.handleAuthentication(response.id, response.username, response.role, response.cart, response.token);
            
        }))
    }

    login(username: string, password: string){
        return this.http.post<AuthResponseData>("http://localhost:8080/api/account/login", {
            username: username,
            password: password
        }).pipe(catchError(this.handleError), tap((response)=>{
            this.handleAuthentication(response.id, response.username, response.role, response.cart, response.token);
        }))
    }

    autoLogin(){
        const accountData: {id: number, username: string, _role: string, _cart: Cart, _token: string} = JSON.parse(localStorage.getItem("accountData")!);
        if(!accountData)
            return;
        const loadedAccount = new Account(accountData.id, accountData.username, accountData._role, accountData._cart, accountData._token);
        if(loadedAccount.token){
            this.account.next(loadedAccount);
        }
        this.accountIdAfterSuccess = accountData.id;
    }

    logout(){
        this.account.next(null!);
        this.router.navigate(["/auth"]);
        localStorage.removeItem("accountData");
        if(this.tokenExpirationTimer)
            clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
        //this.cartService.clearCart();
    }

    // autoLogout(expirationDuration: number){
    //     console.log(expirationDuration)
    //     this.tokenExpirationTimer = setTimeout(()=>{
    //         this.logout()
    //     }, expirationDuration)
    // }

    private handleAuthentication(id:number, username: string,  role: string, cart: Cart, token: string){
        //const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const account = new Account(id, username, role, cart, token);
        this.account.next(account);
        localStorage.setItem("accountData", JSON.stringify(account));
        this.accountIdAfterSuccess = account.id;
    }

    private handleError(errorResponse: HttpErrorResponse){
        let errorMessage = "An unknown error occurred";
        if(!errorResponse.error){
            return throwError(()=>errorMessage);
        }
        errorMessage = errorResponse.error.message;
        return throwError(()=>errorMessage);
    }

    // async handleCart(): Promise<void> {
    //     let list: any = [];
    //     const cart = await this.http.get<any>(`http://localhost:8080/api/cart/account/${this.accountIdAfterSuccess}`).toPromise();
    //     if(cart){
    //       const productsAndQuantity = await this.http.get<any>(`http://localhost:8080/api/product/cart/${cart.id}`).toPromise();
    //       const files = await this.http.get<any>(`http://localhost:8080/api/file`).toPromise();
    //       if(files){
    //         for (let productAndQuantity of productsAndQuantity) {
    //           for (let file of files) {
    //             if (productAndQuantity.product.id == file.product.id) {
    //               let index = file.path.indexOf("assets");
    //               let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
    //               list.push(result);
    //             }
    //           }
    //           productAndQuantity.product.file = list;
    //           list = [];
    //         }
    //         this.cartService.setCart(cart.id, productsAndQuantity, cart.account.id);
    //       }
    //     }
    // }
    
}