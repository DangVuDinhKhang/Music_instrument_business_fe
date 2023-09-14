import { Component } from '@angular/core';
import { Supplier } from './supplier.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { SupplierService } from './supplier.service';

@Component({
  selector: 'app-manage-supplier',
  templateUrl: './manage-supplier.component.html',
  styleUrls: ['./manage-supplier.component.scss']
})
export class ManageSupplierComponent {
  suppliers: Supplier[] = [];
  needToDeleteSupplierId = 0;
  constructor(
    private http: HttpClient, private router: Router, private supplierService: SupplierService, 
    private authService: AuthService, private modalService: NgbModal
  ){}

  ngOnInit() {
    this.getSuppliers();
  }

  getSuppliers(){
    this.http.get<Supplier[]>(`http://localhost:8080/api/supplier`).subscribe((responseData) => {
      this.suppliers = responseData;
    })
  }

  onUpdate(supplier: Supplier){
    this.supplierService.setNeedUpdateSupplier(supplier);
    this.router.navigate(['/manage/suppliers/update', supplier.id] );
  }

  open(modal: any, supplier: Supplier){
    
    this.modalService.open(modal);
    this.needToDeleteSupplierId = supplier.id;
  }

  onDelete(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.delete<Supplier>(`http://localhost:8080/api/supplier/${this.needToDeleteSupplierId}`, {headers}).subscribe((responseData) => {
      this.suppliers = this.suppliers.filter(supplier => supplier.id != this.needToDeleteSupplierId);
      this.modalService.dismissAll();
      this.needToDeleteSupplierId = 0;
    })
  }
}
