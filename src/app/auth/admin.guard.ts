import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable, map, take, tap } from "rxjs";
import { Router, UrlTree } from "@angular/router";

@Injectable({providedIn: "root"})
export class AdminGuard{

    constructor(private authService: AuthService, private router: Router){}

    canActivate():| Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.account.pipe(
            take(1),
            map((account)=>{
                return account.role === "admin" ? true : false;
            }),
            tap((isAuth)=>{
                if(!isAuth)
                    this.router.navigate(["/"])
            })
        );
    }
}