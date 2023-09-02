import { Component } from '@angular/core';
import { Category } from './category.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoryService } from './category.service';
import { AuthService } from '../auth/auth.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {
  categories: Category[] = [];
  needToDeleteCategoryId = 0;
  constructor(
    private http: HttpClient, private router: Router, private categoryService: CategoryService, 
    private authService: AuthService, private modalService: NgbModal
  ){}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(){
    this.http.get<Category[]>(`http://localhost:8080/api/category`).subscribe((responseData) => {
      this.categories = responseData;
    })
  }

  onUpdate(category: Category){
    this.categoryService.setNeedUpdateCategory(category);
    this.router.navigate(['/manage/categories/update', category.id] );
  }

  open(modal: any, category: Category){
    
    this.modalService.open(modal);
    this.needToDeleteCategoryId = category.id;
  }

  onDelete(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.delete<Category[]>(`http://localhost:8080/api/category/${this.needToDeleteCategoryId}`, {headers}).subscribe((responseData) => {
      this.categories = this.categories.filter(category => category.id != this.needToDeleteCategoryId);
      this.modalService.dismissAll();
      this.needToDeleteCategoryId = 0;
    })
  }
}
