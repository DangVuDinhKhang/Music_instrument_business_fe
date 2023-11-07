import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductService } from '../product/product.service';
import {File} from '../shared/file.model'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ToastService } from '../shared/toast/toast.service';
import { Rating } from '../shared/rating,model';




@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit{
    
  product!: Product;
  relatedProducts: Product[] = [];
  files: File[] = [];
  filesOfRelatedProducts: File[] = [];
  ratings: Rating[] = [];
  averageStar: number = 0;

  private userSub!: Subscription;
  isAuthenticated = false;
  cartId = 0;

  selectedFile: any;

  constructor(
    private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private authService: AuthService, private productService: ProductService, private toastService: ToastService
  ){}

  ngOnInit() {
    this.route.params.subscribe(()=>{
      window.scrollTo(0, 0);
      this.getProductById();
    })
    
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
    this.http.get<Product>(`http://localhost:8080/api/product/${this.route.snapshot.url.join('/')}`).subscribe((product) => {
      this.product = product;
      this.http.get<any>(`http://localhost:8080/api/file`).subscribe((files)=>{
        this.files = files;
        for(let file of this.files){
          if(this.product.id == file.product.id){
            let index = file.path.indexOf("assets");
            let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
            list.push(result);
          }
        }
        this.product.file = list;
        this.selectedFile = this.product.file[0];
        this.http.get<Rating[]>(`http://localhost:8080/api/rating/product/${product.id}`).subscribe((ratings)=>{
          this.ratings = ratings
          this.ratings.map((rating)=>this.averageStar += rating.star);
          
          this.averageStar /= this.ratings.length;
          
          this.averageStar = Math.round(this.averageStar * 10) / 10;

          if(isNaN(this.averageStar))
            this.averageStar = 0;
          // if(isFinite(this.averageStar)){
          //   this.averageStar = 0;
          // }
        })
      })
      let listOfImage: any = []
      this.http.get<Product[]>(`http://localhost:8080/api/product/${this.product.id}/category/${this.product.category.id}`).subscribe((responseData) => {
        this.relatedProducts = responseData
        this.http.get<any>(`http://localhost:8080/api/file`).subscribe((responseData)=>{
          this.filesOfRelatedProducts = responseData;
          for(let relatedProduct of this.relatedProducts){
            for(let file of this.filesOfRelatedProducts){
              if(relatedProduct.id == file.product.id){
                let index = file.path.indexOf("assets");
                let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
                listOfImage.push(result);
              }
            }
            relatedProduct.file = listOfImage;
            listOfImage = [];
          }
        })
      });
    });
  }


  addToCart(productId: number){
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

  updateImage(file: any){
    this.selectedFile = file;
  }

}
