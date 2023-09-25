import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: "root"})
export class StatisticService {
    base_URL = 'http://localhost:8080/api';

    headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.account.value.token}`
    });

    constructor(private http: HttpClient, private authService: AuthService){}

    statisticRevenueByMonth(): Observable<any>{

        const params = new HttpParams().set('type', 'month')
        
        return this.http.get<any>(`${this.base_URL}/order/statistic`,  {params: params, headers: this.headers});
    }
    statisticRevenueByDay(): Observable<any>{

        const params = new HttpParams().set('type', 'day')
        
        return this.http.get<any>(`${this.base_URL}/order/statistic`,  {params: params, headers: this.headers});
    }

    statisticMember(): Observable<any>{
        
        return this.http.get<any>(`${this.base_URL}/account/statistic`, {headers: this.headers});
    }

    statisticRating(): Observable<any>{
        
        return this.http.get<any>(`${this.base_URL}/rating/statistic`, {headers: this.headers});
    }

    statisticOrder(): Observable<any>{
        
        return this.http.get<any>(`${this.base_URL}/order/statistic-total`, {headers: this.headers});
    }
}