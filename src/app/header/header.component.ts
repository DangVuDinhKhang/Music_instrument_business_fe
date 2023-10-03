import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../product/product.service';
import { CartService } from '../cart/cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../manage-category/category.model';
import { NgForm } from '@angular/forms';
import { Product } from '../product/product.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private userSub!: Subscription;
  isAuthenticated = false;
  role = "member";
  username = "";
  numberOfType = 0;
  
  showDropdown = false;
  categories!: Category[];

  file: any;

  constructor(private authService: AuthService, private productService: ProductService, private modalService: NgbModal,
    private http: HttpClient, private router: Router){}

  ngOnInit(){
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.username = account.username;
        if(account.role == "admin")
          this.role = "admin"
        else
          this.role = "member"
      }
    })

    this.http.get<Category[]>(`http://localhost:8080/api/category`).subscribe((categories)=>{
      this.categories = categories
    })
  
  //  this.cartService.handleCart().then(()=>{                  // Display quantity in cart
  //   this.numberOfType = this.cartService.numberOfType;
  //  }).catch(error=>{
  //   console.error(error)
  //  });
   
  }

  open(modal: any){
    
    this.modalService.open(modal);
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;
      this.http.get<Product[]>(`http://localhost:8080/api/product/search/${form.value.search}`).subscribe((products)=>{
        this.productService.setSearchProduct(products);
        this.router.navigate([`/products/search/${form.value.search}`]);
        form.resetForm();
      })
    
  }

  onSubmitImage(form: NgForm){
    if(!form.valid)
      return;

    const formData = new FormData();
    formData.append("image", this.file);

    this.http.post<any>(`http://localhost:5000/predict`, formData).subscribe((response)=>{
      this.modalService.dismissAll();
      this.http.get<Product[]>(`http://localhost:8080/api/product/search/${response.prediction}`).subscribe((products)=>{
        this.productService.setSearchProduct(products);
        this.router.navigate([`/products/search/${response.prediction}`]);
        form.resetForm();
      })
    })
    
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  
  onLogout(){
    this.authService.logout();
  }

  public setDropDown(isVisible: boolean): void {
    this.showDropdown = isVisible;
  }

}
