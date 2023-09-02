import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  
  products: Product[] = [];

  constructor(private http: HttpClient, private productService: ProductService){}

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    this.http.get<Product[]>(`http://localhost:8080/api/product`).subscribe((responseData) => {
        this.products = responseData;
    });
  }

}
