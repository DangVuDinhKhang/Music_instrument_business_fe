import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrderDetail } from './order-detail.model';
import { Order } from '../manage-order/order.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import {File} from '../shared/file.model'
import { Product } from '../product/product.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ToastService } from '../shared/toast/toast.service';
import { Rating } from '../shared/rating,model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{

  orders: Order[] = [];
  ordersDetailOfOrders: any = [];
  private userSub!: Subscription;
  isAuthenticated = false;
  accountId!: number;
  username!: string;

  totalPriceAndStatus: any = [];
  files: File[] = [];

  needToRatingProductId!: number;
  star!: number;

  ratings: Rating[] = [];
  ratedProduct: number[] = [];

  labelOfRating = ["Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"]

  constructor(
    private http: HttpClient, private authService: AuthService, 
    private modalService: NgbModal, private toastService: ToastService
  ){}

  ngOnInit(): void {
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.accountId = account.id;
        this.username = account.username
      }
    })
    this.getAllOrder();
    this.getRatingByAccountId();
  }

  open(modal: any, product: Product){
    
    this.modalService.open(modal);
    this.needToRatingProductId = product.id;
    this.star = 5
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;
    const star = this.star;
    const content = form.value.content;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    
    this.http.post<any>(`http://localhost:8080/api/rating`, {
      content: content, 
      star: star,
      account: {id: this.accountId},
      product: {id: this.needToRatingProductId}
    }, 
    {headers}).subscribe((responseData)=>{
      console.log(responseData);
      this.ratedProduct.push(this.needToRatingProductId)
      this.modalService.dismissAll();
      this.toastService.updateSuccess(true);
      this.toastService.updateMessage("Đánh giá sản phẩm thành công");
      setTimeout(()=>{
        this.toastService.updateSuccess(false);
      }, 2500)
    });
    
  }

  getRatingByAccountId(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.get<Rating[]>(`http://localhost:8080/api/rating/account/${this.accountId}`, {headers}).subscribe((ratings)=>{
      this.ratings = ratings;
      this.ratings.map((rating)=>{
        this.ratedProduct.push(rating.product.id);
      })
    })
  }

  getAllOrder(){
    this.http.get<Order[]>(`http://localhost:8080/api/order/account/${this.accountId}`).subscribe((orders)=>{
      this.orders = orders;
      this.getAllOrderDetail()
    })
  }

  getAllOrderDetail(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    for(let order of this.orders){
      this.http.get<OrderDetail[]>(`http://localhost:8080/api/order-detail/${order.id}`, {headers}).subscribe((ordersDetailOfOrders)=>{
        this.ordersDetailOfOrders.push(ordersDetailOfOrders);
        this.totalPriceAndStatus.push({
          totalPrice: ordersDetailOfOrders[0].customerOrder.total, 
          status: ordersDetailOfOrders[0].customerOrder.status
        });
        let list: any = [];
        this.http.get<any>(`http://localhost:8080/api/file`).subscribe((responseData)=>{
          this.files = responseData;
          for(let orderDetail of ordersDetailOfOrders){
            for(let file of this.files){
              if(orderDetail.product.id == file.product.id){ 
                let index = file.path.indexOf("assets");
                let result = "../../" + file.path.slice(index).replace(/\\/g, "/");
                list.push(result);
              }
            }
            orderDetail.product.file = list;
            list = [];
          }
        })
      })
    }
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
