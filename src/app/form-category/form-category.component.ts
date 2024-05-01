import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Category } from '../manage-category/category.model';
import { CategoryService } from '../manage-category/category.service';

@Component({
  selector: 'app-form-category',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.scss']
})
export class FormCategoryComponent implements OnInit{
  
  isAdd: boolean = true;
  name = ""
  
  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private authService: AuthService, private categoryService: CategoryService
  ){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    if(this.route.snapshot.url.join("/").includes("update")){
      console.log(this.route.snapshot.url.join("/"))
      this.isAdd = false;
      this.name = this.categoryService.needUpdateCategory.name;
    }
      
  }
  
  onSubmit(form: NgForm){
    if(!form.valid)
      return;

    const name = form.value.name;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    
    if(this.isAdd){
      this.http.post<Category>(`http://localhost:8080/api/category/`, {name: name}, {headers}).subscribe((responseData)=>{
        this.router.navigate(["/manage/categories"]);
      });
    }
    else{
      this.http.put<Category>(`http://localhost:8080/api/category/${this.categoryService.needUpdateCategory.id}`, {name: name}, {headers}).subscribe((responseData)=>{
        console.log(responseData);
        this.router.navigate(["/manage/categories"]);
      });
    }
    
  }
}
