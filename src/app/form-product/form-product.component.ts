import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { Category } from '../manage-category/category.model';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit{

  @ViewChild("productForm") productForm!: NgForm
  isInvalidForm: boolean = true;
  isAdd: boolean = true;
  categories: Category[] = []
  name = "";
  description = "";
  price = 0;
  categoryId = 0;
  file!: any;

  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private authService: AuthService, private productService: ProductService
  ){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    if(this.route.snapshot.url.join("/").includes("update")){
      this.isAdd = false;
      this.name = this.productService.needUpdateProduct.name;
      this.description = this.productService.needUpdateProduct.description;
      this.price = this.productService.needUpdateProduct.price;
      this.categoryId = this.productService.needUpdateProduct.category.id;
      this.isInvalidForm = false;
    }
    this.getCategories();
  }

  getCategories(){
    this.http.get<Category[]>(`http://localhost:8080/api/category`).subscribe((responseData) => {
      this.categories = responseData;
    })
  }

  onSelectChange(){
    if (!this.productForm.valid || this.categoryId == 0) {
      this.isInvalidForm = true;
    } 
    else {
      this.isInvalidForm = false;
    }
    console.log(this.isInvalidForm)
  }

  onFileSelected(event: any) {
    this.file = event.target.files;
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;

    const category = {id: form.value.category};
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("description", this.description);
    formData.append("price", this.price.toString());
    formData.append("category", JSON.stringify(category));
    if(this.file)
      for(let i = 0; i < this.file.length; i++)
        formData.append("file", this.file[i]);

    if(this.isAdd){
      this.http.post<Product>("http://localhost:8080/api/product", formData, {headers}).subscribe((responseData)=>{
        this.router.navigate(["/manage/products"]);
      });
    }
    else{
      this.http.put<Product>(`http://localhost:8080/api/product/${this.productService.needUpdateProduct.id}`, 
      formData, {headers}).subscribe((responseData)=>{
        this.router.navigate(["/manage/products"]);
      });
    }
    
  }
}
