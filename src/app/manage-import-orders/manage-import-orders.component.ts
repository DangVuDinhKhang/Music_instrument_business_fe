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

  orders: ImportOrder[] = [];
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
    this.http.get<ImportOrder[]>(`http://localhost:8080/api/import-order`, {headers}).subscribe((orders)=>{
      this.orders = orders;
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
}
