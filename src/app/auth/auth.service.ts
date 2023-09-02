import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { Account } from "./account.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    id: number
    username: string
    role: string
    token: string
}

@Injectable({providedIn: "root"})
export class AuthService{
    account = new BehaviorSubject<Account>(null!);
    private tokenExpirationTimer: any;
    
    constructor(private http: HttpClient, private router: Router){}

    signUp(username: string, password: string) {
        return this.http.post<AuthResponseData>("http://localhost:8080/api/account/register", {
            username: username,
            password: password
        }).pipe(catchError(this.handleError), tap((response)=>{
            this.handleAuthentication(response.id, response.username, response.role, response.token);
            
        }))
    }

    login(username: string, password: string){
        return this.http.post<AuthResponseData>("http://localhost:8080/api/account/login", {
            username: username,
            password: password
        }).pipe(catchError(this.handleError), tap((response)=>{
            this.handleAuthentication(response.id, response.username, response.role, response.token);
            
        }))
    }

    autoLogin(){
        const accountData: {id: number, username: string, _role: string, _token: string} = JSON.parse(localStorage.getItem("accountData")!);
        if(!accountData)
            return;
        const loadedAccount = new Account(accountData.id, accountData.username, accountData._role, accountData._token);
        if(loadedAccount.token){
            this.account.next(loadedAccount);
        }
        
    }

    logout(){
        this.account.next(null!);
        this.router.navigate(["/auth"]);
        localStorage.removeItem("accountData");
        if(this.tokenExpirationTimer)
            clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
    }

    // autoLogout(expirationDuration: number){
    //     console.log(expirationDuration)
    //     this.tokenExpirationTimer = setTimeout(()=>{
    //         this.logout()
    //     }, expirationDuration)
    // }

    private handleAuthentication(id:number, username: string,  role: string, token: string){
        //const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const account = new Account(id, username, role, token);
        this.account.next(account);
        localStorage.setItem("accountData", JSON.stringify(account));
    }

    private handleError(errorResponse: HttpErrorResponse){
        let errorMessage = "An unknown error occurred";
        if(!errorResponse.error){
            return throwError(()=>errorMessage);
        }
        errorMessage = errorResponse.error.message;
        return throwError(()=>errorMessage);
    }
}