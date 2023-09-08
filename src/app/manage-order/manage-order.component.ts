import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order } from './order.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit{

  orders: Order[] = [];

  constructor(private http: HttpClient, private authService: AuthService){}
  
  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.get<Order[]>(`http://localhost:8080/api/order`, {headers}).subscribe((orders)=>{
      this.orders = orders;
    })
  }

  onUpdate(order: Order){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.put<Order>(`http://localhost:8080/api/order/${order.id}`, {status: !order.status}, {headers}).subscribe(()=>{
      this.orders.map((specificOrder) => {
        if(specificOrder.id == order.id)
          specificOrder.status = !specificOrder.status
      })
    })
  }
}
