import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SupplierService } from '../manage-supplier/supplier.service';
import { NgForm } from '@angular/forms';
import { Supplier } from '../manage-supplier/supplier.model';

@Component({
  selector: 'app-form-supplier',
  templateUrl: './form-supplier.component.html',
  styleUrls: ['./form-supplier.component.scss']
})
export class FormSupplierComponent {
  isAdd: boolean = true;
  name = ""
  contact = ""
  
  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private authService: AuthService, private supplierService: SupplierService
  ){}

  ngOnInit(): void {
    if(this.route.snapshot.url.join("/").includes("update")){
      console.log(this.route.snapshot.url.join("/"))
      this.isAdd = false;
      this.name = this.supplierService.needUpdateSupplier.name;
      this.contact = this.supplierService.needUpdateSupplier.contact;
    }
      
  }
  
  onSubmit(form: NgForm){
    if(!form.valid)
      return;

    const name = form.value.name;
    const contact = form.value.contact;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    
    if(this.isAdd){
      this.http.post<Supplier>(`http://localhost:8080/api/supplier/`, {name: name, contact: contact}, {headers}).subscribe((responseData)=>{
        this.router.navigate(["/manage/suppliers"]);
      });
    }
    else{
      this.http.put<Supplier>(`http://localhost:8080/api/supplier/${this.supplierService.needUpdateSupplier.id}`, 
      {name: name, contact: contact}, {headers}).subscribe((responseData)=>{
        this.router.navigate(["/manage/suppliers"]);
      });
    }
    
  }
}
