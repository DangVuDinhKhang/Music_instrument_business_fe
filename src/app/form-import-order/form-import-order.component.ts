import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { ImportOrderService } from '../manage-import-orders/import-order.service';
import { Product } from '../product/product.model';
import { Supplier } from '../manage-supplier/supplier.model';

@Component({
  selector: 'app-form-import-order',
  templateUrl: './form-import-order.component.html',
  styleUrls: ['./form-import-order.component.scss']
})
export class FormImportOrderComponent {

  products: Product[] = [];
  suppliers: Supplier[] = [];
  selectedSupplier: number = 0;
  items: any[] = [];
  isAdd: boolean = true;
  name = ""




  addItem() {

    const newItem: any = Object.assign({}, this.items[0]);
    this.items.push(newItem);
  }
  
  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private authService: AuthService
  ){}

  ngOnInit(): void {
    if(this.route.snapshot.url.join("/").includes("update")){
      console.log(this.route.snapshot.url.join("/"))
      this.isAdd = false;
      //this.name = this.categoryService.needUpdateCategory.name;
    } 
    this.getProducts();
    this.getSuppliers();
  }

  getProducts(){
    this.http.get<Product[]>(`http://localhost:8080/api/product`).subscribe((products) => {
      this.products = products;
    })
  }

  getSuppliers(){
    this.http.get<Supplier[]>(`http://localhost:8080/api/supplier`).subscribe((suppliers) => {
      this.suppliers = suppliers;
    })
  }
  
  onSubmit(form: NgForm){
    if(!form.valid)
      return;
    console.log(form.value)
    // const name = form.value.name;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.authService.account.value.token}`
    // });
    
    // if(this.isAdd){
    //   this.http.post<ImportOrderService>(`http://localhost:8080/api/import-orders/`, {name: name}, {headers}).subscribe((responseData)=>{
    //     this.router.navigate(["/manage/categories"]);
    //   });
    // }
    // else{
    //   this.http.put<Category>(`http://localhost:8080/api/category/${this.categoryService.needUpdateCategory.id}`, {name: name}, {headers}).subscribe((responseData)=>{
    //     console.log(responseData);
    //     this.router.navigate(["/manage/categories"]);
    //   });
    // }
    
  }
}
