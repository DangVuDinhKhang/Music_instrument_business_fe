import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  products: Product[] = [];
  constructor(private http: HttpClient){}

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    this.http.get<Product[]>(`http://localhost:8080/api/product`).subscribe((responseData) => {
        this.products = responseData;
    })
  }
}
