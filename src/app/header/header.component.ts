import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../product/product.service';
import { CartService } from '../cart/cart.service';
import { HttpClient } from '@angular/common/http';
import { Category } from '../manage-category/category.model';

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
  categories!: Category[]

  constructor(private authService: AuthService, private cartService: CartService, private http: HttpClient){}

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
