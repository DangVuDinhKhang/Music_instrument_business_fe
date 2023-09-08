import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrderDetail } from './order-detail.model';
import { Order } from '../manage-order/order.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{

  orders: Order[] = [];
  ordersDetail: OrderDetail[] = [];
  private userSub!: Subscription;
  isAuthenticated = false;
  accountId!: number;

  constructor(private http: HttpClient, private authService: AuthService){}

  ngOnInit(): void {
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.accountId = account.id;
      }
    })
    this.getAllOrder();
    this.getAllOrderDetail();
  }

  getAllOrder(){
    this.http.get<Order[]>(`http://localhost:8080/api/order/account/${this.accountId}`).subscribe((orders)=>{
      this.orders = orders;
      this.getAllOrderDetail()
    })
  }

  getAllOrderDetail(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    for(let order of this.orders){
      this.http.get<OrderDetail[]>(`http://localhost:8080/api/order-detail/${order.id}`, {headers}).subscribe((ordersDetail)=>{
        this.ordersDetail = ordersDetail;
        console.log(this.ordersDetail);
      })
    }
    
    
  }
}
