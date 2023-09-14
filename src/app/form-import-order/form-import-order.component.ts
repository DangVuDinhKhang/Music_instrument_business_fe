import { Component } from '@angular/core';

@Component({
  selector: 'app-form-import-order',
  templateUrl: './form-import-order.component.html',
  styleUrls: ['./form-import-order.component.scss']
})
export class FormImportOrderComponent {
  // isAdd: boolean = true;
  // name = ""
  
  // constructor(
  //   private http: HttpClient, private router: Router, private route: ActivatedRoute, 
  //   private authService: AuthService, private categoryService: CategoryService
  // ){}

  // ngOnInit(): void {
  //   if(this.route.snapshot.url.join("/").includes("update")){
  //     console.log(this.route.snapshot.url.join("/"))
  //     this.isAdd = false;
  //     this.name = this.categoryService.needUpdateCategory.name;
  //   }
      
  // }
  
  // onSubmit(form: NgForm){
  //   if(!form.valid)
  //     return;

  //   const name = form.value.name;
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.authService.account.value.token}`
  //   });
    
  //   if(this.isAdd){
  //     this.http.post<Category>(`http://localhost:8080/api/category/`, {name: name}, {headers}).subscribe((responseData)=>{
  //       this.router.navigate(["/manage/categories"]);
  //     });
  //   }
  //   else{
  //     this.http.put<Category>(`http://localhost:8080/api/category/${this.categoryService.needUpdateCategory.id}`, {name: name}, {headers}).subscribe((responseData)=>{
  //       console.log(responseData);
  //       this.router.navigate(["/manage/categories"]);
  //     });
  //   }
    
  // }
}
