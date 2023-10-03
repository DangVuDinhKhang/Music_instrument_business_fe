import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PaymentService } from '../manage-payment/payment.service';
import { NgForm } from '@angular/forms';
import { Payment } from '../manage-payment/payment.model';

@Component({
  selector: 'app-form-payment',
  templateUrl: './form-payment.component.html',
  styleUrls: ['./form-payment.component.scss']
})
export class FormPaymentComponent {
  isAdd: boolean = true;
  name = ""
  
  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private authService: AuthService, private paymentService: PaymentService
  ){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    if(this.route.snapshot.url.join("/").includes("update")){
      console.log(this.route.snapshot.url.join("/"))
      this.isAdd = false;
      this.name = this.paymentService.needUpdatePayment.name;
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
      this.http.post<Payment>(`http://localhost:8080/api/payment/`, {name: name}, {headers}).subscribe((responseData)=>{
        this.router.navigate(["/manage/payments"]);
      });
    }
    else{
      this.http.put<Payment>(`http://localhost:8080/api/payment/${this.paymentService.needUpdatePayment.id}`, {name: name}, {headers}).subscribe((responseData)=>{
        console.log(responseData);
        this.router.navigate(["/manage/payments"]);
      });
    }
    
  }
}
