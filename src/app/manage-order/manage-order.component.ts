import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order } from './order.model';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit{

  orders: Order[] = [];
  selectedOrder!: Order;

  constructor(private http: HttpClient, private authService: AuthService, private modalService: NgbModal){}
  
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

  open(content: any, order: Order){
    this.selectedOrder = order;
    this.modalService.open(content);
  }

  onUpdate(order: Order){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.put<Order>(`http://localhost:8080/api/order/${order.id}`, {status: order.status}, {headers}).subscribe();
  }
}
