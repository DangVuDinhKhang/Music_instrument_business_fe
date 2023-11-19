import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result-payment',
  templateUrl: './result-payment.component.html',
  styleUrls: ['./result-payment.component.scss']
})
export class ResultPaymentComponent implements OnInit{

  status!: boolean;
  customerOrderId: any;
  total!: number;

  constructor(private http: HttpClient, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.updateStatus();
    let params = new URLSearchParams(window.location.search);
    this.total = Number(params.get('vnp_Amount')) / 100.0;

  }


  updateStatus() {
    let s = window.location.href.match(/\/(\d+)\?/);
    let customerOrderId = s ? s[1] : null;
    this.customerOrderId = customerOrderId;
    if(window.location.href.includes('ResponseCode=00')){
      this.status = true;
      this.http.put<any>(`http://localhost:8080/api/order/vnpay/${customerOrderId}?status=1`, {}).subscribe((responseData)=>{
        console.log(responseData);
      })
    }
    else{
      this.status = false;
      this.http.put<any>(`http://localhost:8080/api/order/vnpay/${customerOrderId}?status=0`, {}).subscribe((responseData)=>{
        console.log(responseData);
      })
    }
  }

}
