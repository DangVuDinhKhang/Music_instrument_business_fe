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
  needToRatingOrderDetail!: number;
  star!: number;

  ratings: Rating[] = [];
  ratedOrderDetails: number[] = [];

  labelOfRating = ["Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"]

  needToRemoveOrder!: Order;

  constructor(
    private http: HttpClient, private authService: AuthService, 
    private modalService: NgbModal, private toastService: ToastService
  ){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.accountId = account.id;
        this.username = account.username
      }
    })
    this.getAllOrder();
    //this.getRatingByAccountId();
  }

  open(modal: any, product: Product, order: any){
    
    this.modalService.open(modal);
    // this.needToRatingProductId = product.id;
    this.needToRatingOrderDetail = order.id;
    this.star = 5;
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
      orderDetail: {id: this.needToRatingOrderDetail}
    }, 
    {headers}).subscribe((responseData)=>{
      for(let orderDetailsOfOrder of this.ordersDetailOfOrders){
        for(let orderDetail of orderDetailsOfOrder){
          if(orderDetail.id == this.needToRatingOrderDetail){
            this.ratedOrderDetails.push(this.needToRatingOrderDetail);
            orderDetail.isRated = true;
            orderDetail.star = star;
          }
        }
      }
      this.modalService.dismissAll();
      this.toastService.updateSuccess(true);
      this.toastService.updateMessage("Đánh giá sản phẩm thành công");
      setTimeout(()=>{
        this.toastService.updateSuccess(false);
      }, 2500)
    });
    
  }

  // getRatingByAccountId(){
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.authService.account.value.token}`
  //   });
  //   this.http.get<Rating[]>(`http://localhost:8080/api/rating/account/${this.accountId}`, {headers}).subscribe((ratings)=>{
  //     this.ratings = ratings;
  //     this.ratings.map((rating)=>{
  //       this.ratedProducts.push(rating.orderDetail.id);
  //     })
  //   })
  // }

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
      this.http.get<any[]>(`http://localhost:8080/api/order-detail/${order.id}`, {headers}).subscribe((ordersDetailOfOrders)=>{
        this.ordersDetailOfOrders.push(ordersDetailOfOrders);
        this.totalPriceAndStatus.push({
          totalPrice: ordersDetailOfOrders[0].customerOrder.total, 
          status: ordersDetailOfOrders[0].customerOrder.status
        });
        this.http.get<Rating[]>(`http://localhost:8080/api/rating/account/${this.accountId}`, {headers}).subscribe((ratings)=>{
          this.ratings = ratings;
          for(let orderDetail of ordersDetailOfOrders){
            for(let rating of ratings){
              if(orderDetail.id == rating.orderDetail.id){
                this.ratedOrderDetails.push(rating.orderDetail.id);
                orderDetail.isRated = true;
                orderDetail.star = rating.star;
              }
            }
          }
          console.log(this.ratedOrderDetails)
        })
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

  // sort(orders: Order[], type: string){
  //   if(type == "asc_date"){
  //     orders.sort((a, b) => b.date.getTime() - a.date.getTime());
  //   } 
  //   else if(type == "desc_date"){
  //     orders.sort((a, b) => a.date.getTime() - b.date.getTime());
  //   }
  //   else{
  //     orders.sort((a, b) => (a.total - b.total));
  //   }

  //   return orders;
  // }

  // sortOrders(event: any){
  //   const backups = []
  //   for(let order of this.orders){
  //     let newObject = {
  //       id: order.id,
  //       date: order.date
  //     }
  //     backups.push(newObject)
  //     let d = order.date.split("-");
  //     let newDate = new Date(d[2] + '/' + d[1] + '/' + d[0]);
  //     order.date = newDate
  //   }

  //   let temps = this.sort(this.orders, event);

  //   for(let temp of temps){
  //     for(let backup of backups){
  //       if(temp.id == backup.id){
  //         temp.date = backup.date
  //       }
  //     }
  //   }

  //   this.orders = temps
    
  // }

  openRemoveModal(modal: any, orderDetal: OrderDetail){
    this.modalService.open(modal);
    this.needToRemoveOrder = orderDetal.customerOrder;
  }

  onDelete(){
    this.modalService.dismissAll();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.put<any>(`http://localhost:8080/api/order/cancel/${this.needToRemoveOrder.id}`, {status: -1}, {headers})
    .subscribe((responseData)=>{
      for(let i = 0; i < this.orders.length; i++)
        if(this.orders[i].id ==this.needToRemoveOrder.id)
          this.totalPriceAndStatus[i].status = -1;
    })
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
