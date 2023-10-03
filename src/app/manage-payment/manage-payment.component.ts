import { Component } from '@angular/core';
import { Payment } from './payment.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PaymentService } from './payment.service';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.scss']
})
export class ManagePaymentComponent {
  payments: Payment[] = [];
  needToDeletePaymentId = 0;
  constructor(
    private http: HttpClient, private router: Router, private paymentService: PaymentService, 
    private authService: AuthService, private modalService: NgbModal
  ){}

  ngOnInit() {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.getCategories();
  }

  getCategories(){
    this.http.get<Payment[]>(`http://localhost:8080/api/payment`).subscribe((responseData) => {
      this.payments = responseData;
    })
  }

  onUpdate(payment: Payment){
    this.paymentService.setNeedUpdatePayment(payment);
    this.router.navigate(['/manage/payments/update', payment.id] );
  }

  open(modal: any, payment: Payment){
    
    this.modalService.open(modal);
    this.needToDeletePaymentId = payment.id;
  }

  onDelete(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.delete<Payment>(`http://localhost:8080/api/payment/${this.needToDeletePaymentId}`, {headers}).subscribe((responseData) => {
      this.payments = this.payments.filter(payment => payment.id != this.needToDeletePaymentId);
      this.modalService.dismissAll();
      this.needToDeletePaymentId = 0;
    })
  }
}
