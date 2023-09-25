import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import {File} from '../shared/file.model'
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent {
  keyWord: any;
  products: Product[] = [];
  files: File[] = []

  constructor(private http: HttpClient, private productService: ProductService, private activatedRoute: ActivatedRoute){}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.keyWord = this.activatedRoute.snapshot.params;
      this.getProducts();
    });
    
  }

  getProducts(){
    this.products = this.productService.searchProduct;
    console.log(this.products)
    let list: any = [];
    this.http.get<any>(`http://localhost:8080/api/file`).subscribe((responseData)=>{
      this.files = responseData;
      for(let product of this.products){
        for(let file of this.files){
          if(product.id == file.product.id){
            let index = file.path.indexOf("assets");
            let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
            list.push(result);
          }
        }
        product.file = list;
        list = [];
      }
    })
 
    
  }
}
