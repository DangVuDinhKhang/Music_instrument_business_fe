import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { ProductService } from './product.service';
import {File} from '../shared/file.model'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  
  products: Product[] = [];
  files: File[] = []

  constructor(private http: HttpClient, private productService: ProductService){}

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    let list: any = [];
    this.http.get<Product[]>(`http://localhost:8080/api/product`).subscribe((responseData) => {
        this.products = responseData;
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
    });
 
    
  }

}
