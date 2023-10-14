import { Component } from '@angular/core';
import { Product } from '../product/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoryService } from '../manage-category/category.service';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportOrder } from './import-order.model';

@Component({
  selector: 'app-manage-import-orders',
  templateUrl: './manage-import-orders.component.html',
  styleUrls: ['./manage-import-orders.component.scss']
})
export class ManageImportOrdersComponent {

  orders: any[] = [];
  selectedOrder!: ImportOrder;

  constructor(private http: HttpClient, private authService: AuthService, private modalService: NgbModal){}
  
  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.getAllOrders();
  }

  getAllOrders(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.get<any>(`http://localhost:8080/api/import-order`, {headers}).subscribe((orders)=>{
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
      for(let order of this.orders){
        this.http.get<any>(`http://localhost:8080/api/import-order-detail/${order.id}`).subscribe((response)=>{
          order.importOrderDetails = response;
        })
      }
    })
  }

  open(content: any, order: ImportOrder){
    this.selectedOrder = order;
    this.modalService.open(content);
  }

  onUpdate(order: ImportOrder){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.put<ImportOrder>(`http://localhost:8080/api/import-order/${order.id}`, {status: order.status}, {headers}).subscribe();
    
  }

  sort(orders: ImportOrder[], type: string){
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
