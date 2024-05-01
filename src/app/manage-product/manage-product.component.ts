import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  products: Product[] = [];
  needToDeleteProductId = 0;
  constructor(
    private http: HttpClient, private modalService: NgbModal, private router: Router,
    private productService: ProductService, private authService: AuthService
  ){}

  ngOnInit() {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.getProducts();
  }

  getProducts(){
    const params = {page: 0, pageSize: 0}
    this.http.get<Product[]>(`http://localhost:8080/api/product`, {params}).subscribe((responseData) => {
        this.products = responseData;
    })
  }

  onUpdate(product: Product){
    this.productService.setNeedUpdateProduct(product);
    this.router.navigate(['/manage/products/update', product.id] );
  }

  open(modal: any, product: Product){
    
    this.modalService.open(modal);
    this.needToDeleteProductId = product.id;
  }

  onDelete(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.delete<Product>(`http://localhost:8080/api/product/${this.needToDeleteProductId}`, {headers}).subscribe((responseData) => {
      this.products = this.products.filter(product => product.id != this.needToDeleteProductId);
      this.modalService.dismissAll();
      this.needToDeleteProductId = 0;
    })
  }
}
