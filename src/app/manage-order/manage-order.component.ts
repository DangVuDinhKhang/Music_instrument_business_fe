import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from './order.model';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit{

  @ViewChild("confirmModal") confirmModal: any;

  orders: any[] = [];
  selectedOrder!: Order;

  constructor(private http: HttpClient, private authService: AuthService, private modalService: NgbModal){}
  
  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.getAllOrders();
  }

  getAllOrders(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.get<any>(`http://localhost:8080/api/order`, {headers}).subscribe((orders)=>{
      const backups = []
      for(let order of orders){
        let newObject = {
          id: order.id,
          date: order.date
        }
        backups.push(newObject)
        let d = order.date.split("-");
        let newDate = new Date(d[2] + '/' + d[1] + '/' + d[0]);
        order.date = newDate
      }
      let temps = this.sort(orders, "asc_date");

      for(let temp of temps){
        for(let backup of backups){
          if(temp.id == backup.id){
            temp.date = backup.date
          }
        }
      }

      this.orders = temps
      
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

  sort(orders: Order[], type: string){
    if(type == "asc_date"){
      orders.sort((a, b) => b.date.getTime() - a.date.getTime());
    } 
    else if(type == "desc_date"){
      orders.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    else{
      orders.sort((a, b) => (a.total - b.total));
    }

    return orders;
  }

  sortOrders(event: any){
    const backups = []
    for(let order of this.orders){
      let newObject = {
        id: order.id,
        date: order.date
      }
      backups.push(newObject)
      let d = order.date.split("-");
      let newDate = new Date(d[2] + '/' + d[1] + '/' + d[0]);
      order.date = newDate
    }

    let temps = this.sort(this.orders, event.target.value);

    for(let temp of temps){
      for(let backup of backups){
        if(temp.id == backup.id){
          temp.date = backup.date
        }
      }
    }

    this.orders = temps
    
  }


}
