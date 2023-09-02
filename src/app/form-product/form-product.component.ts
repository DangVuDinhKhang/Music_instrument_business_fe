import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit{

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private authService: AuthService){}

  ngOnInit(): void {
      
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return
    const name = form.value.username;
    const description = form.value.description;
    const price = form.value.price;
    const amount = form.value.amount;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });

    this.http.post<any>("http://localhost:8080/api/product", {
      name: name,
      description: description,
      price: price,
      amount: amount
    }, {headers}).subscribe((responseData)=>{
      console.log(responseData);
      this.router.navigate(["/manage/products"]);
    });
  }
}
