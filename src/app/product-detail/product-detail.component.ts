import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductService } from '../product/product.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit{
    
  product: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService){}

  ngOnInit() {
      this.getProductById();
  }

  getProductById(){
    const params = new HttpParams().set('id', this.route.snapshot.url.join('/'))
    this.http.get<Product>(`http://localhost:8080/api/product/${this.route.snapshot.url.join('/')}`).subscribe((responseData) => {
        this.product = responseData;
    });
  }
}
