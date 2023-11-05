import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { ProductService } from './product.service';
import {File} from '../shared/file.model'
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../shared/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../manage-category/category.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  
  products: Product[] = [];
  files: File[] = [];

  private userSub!: Subscription;
  isAuthenticated = false;
  cartId = 0;

  categories!: Category[];

  keyWord: any;

  page: number = 0;
  pageSize: number = 6;

  constructor(
    private http: HttpClient, private productService: ProductService, private router: Router,
    private authService: AuthService, private toastService: ToastService, private activatedRoute: ActivatedRoute
  ){}

  ngOnInit() {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    if(this.activatedRoute.snapshot.routeConfig?.path?.includes("category")){
      this.activatedRoute.paramMap.subscribe((params) => {
        this.getProductsByCategory();
      });
    }
    else if(this.activatedRoute.snapshot.routeConfig?.path?.includes("search")){
      this.activatedRoute.paramMap.subscribe((params) => {
        this.keyWord = this.activatedRoute.snapshot.params;
        this.getProductsByName();
      });
    }
    else{
      this.getProducts();
    }
    
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.cartId = account.cart.id;       
      }
    })
    this.http.get<Category[]>(`http://localhost:8080/api/category`).subscribe((categories)=>{
      this.categories = categories
    })
  }

  getProducts(){
    let list: any = [];
    const params = {page: this.page, pageSize: this.pageSize}
    this.http.get<Product[]>(`http://localhost:8080/api/product`, {params}).subscribe((responseData) => {
        this.products = this.sort(responseData, "name");
        
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

  loadMore() {
    this.pageSize += 6;
    this.getProducts();
  }

  getProductsByCategory(){
    let list: any = [];
    const categoryId = this.activatedRoute.snapshot.url[2].path
    this.http.get<Product[]>(`http://localhost:8080/api/product/category/${categoryId}`).subscribe((responseData) => {
        this.products = this.sort(responseData, "name");
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

  getProductsByName(){
    this.products = this.sort(this.productService.searchProduct, "name");
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

  addToCart(productId: number){
    console.log(productId)
    if(this.isAuthenticated){
      this.productService.addToCart(productId, this.cartId);
      this.toastService.updateSuccess(true);
      this.toastService.updateMessage("Sản phẩm đã được thêm vào giỏ hàng");
      setTimeout(()=>{
        this.toastService.updateSuccess(false);
      }, 2500)
    }
    else{
      this.router.navigate(['/auth']);
    }
  }

  sort(products: Product[], type: string){
    if(type == "name"){
      products.sort((a, b) => {
        const nameA = a.name.toLowerCase(); // Chuyển đổi tên thành chữ thường để so sánh không phân biệt hoa thường
        const nameB = b.name.toLowerCase();
      
        return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
      }); 
    }
    else if(type == "asc_price"){
      products.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        }
        if (a.price > b.price) {
          return 1;
        }
        return 0; // Trả về 0 nếu giá trị bằng nhau
      });
    }
    else if(type == "desc_price"){
      products.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        }
        if (a.price < b.price) {
          return 1;
        }
        return 0; // Trả về 0 nếu giá trị bằng nhau
      });
    }
    return products;
  }

  sortProducts(event: any){
    this.products = this.sort(this.products, event.target.value);
  }

}
