import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductService } from '../product/product.service';
import {File} from '../shared/file.model'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit{
    
  product!: Product;
  files: File[] = [];

  private userSub!: Subscription;
  isAuthenticated = false;
  cartId = 0;

  constructor(
    private http: HttpClient, private route: ActivatedRoute, 
    private authService: AuthService, private productService: ProductService
  ){}

  ngOnInit() {
      this.getProductById();
      this.userSub = this.authService.account.subscribe((account)=>{
        this.isAuthenticated = !account ? false : true;
        if(this.isAuthenticated){
          this.cartId = account.cart.id;       
        }
      })
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  getProductById(){
    let list: any = [];
    this.http.get<Product>(`http://localhost:8080/api/product/${this.route.snapshot.url.join('/')}`).subscribe((responseData) => {
        this.product = responseData;
        this.http.get<any>(`http://localhost:8080/api/file`).subscribe((responseData)=>{
          this.files = responseData;
          for(let file of this.files){
            if(this.product.id == file.product.id){
              let index = file.path.indexOf("assets");
              let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
              list.push(result);
            }
          }
          this.product.file = list;
        })
    });
  }


  addToCart(productId: number){
    this.productService.addToCart(productId, this.cartId);
    
  }
}
