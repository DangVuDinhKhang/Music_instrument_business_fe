import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { ActivatedRoute } from '@angular/router';
import { File } from '../shared/file.model';

@Component({
  selector: 'app-filter-product-component',
  templateUrl: './filter-product-component.component.html',
  styleUrls: ['./filter-product-component.component.scss']
})
export class FilterProductComponentComponent {
  products: Product[] = [];
  files: File[] = []

  constructor(private http: HttpClient, private productService: ProductService, private activatedRoute: ActivatedRoute){}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getProducts();
    });
  }

  getProducts(){
    let list: any = [];
    const categoryId = this.activatedRoute.snapshot.url[2].path
    this.http.get<Product[]>(`http://localhost:8080/api/product/category/${categoryId}`).subscribe((responseData) => {
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
