import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product.model';
import { File } from '../shared/file.model'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  products!: Product[];
  files!: File[];

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:8080/api/product/popular`).subscribe((response)=>{
      let listProduct: Product[] = []
      let list: any = [];
      for(let i = 0; i < 3; i++){
        this.http.get<Product>(`http://localhost:8080/api/product/${response[i][0]}`).subscribe((product)=>{
          listProduct.push(product);
          this.products = listProduct;
          
        })
      }
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
