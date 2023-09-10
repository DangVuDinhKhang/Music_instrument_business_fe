import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  private userSub!: Subscription;
  isAuthenticated = false;

  accountId!: number;
  username!: string;
  phone!: string;
  address!: string;

  rating = 2;

  constructor(private authService: AuthService, private http: HttpClient, private toastService: ToastService){}

  ngOnInit(): void {
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.accountId = account.id;
        this.username = account.username;
        this.phone = account.phone;
        this.address = account.address;
      }
    })
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    
    this.http.put<any>(`http://localhost:8080/api/account/${this.accountId}`, {
      phone: this.phone,
      address: this.address
    }, 
    {headers}).subscribe((responseData)=>{
      let account: any = localStorage.getItem("accountData");
      account = JSON.parse(account);
      if(account){
        account.phone = this.phone;
        account.address = this.address;
      }
      localStorage.setItem("accountData", JSON.stringify(account));
      this.toastService.updateSuccess(true);
      this.toastService.updateMessage("Cập nhật hồ sơ thành công");
      setTimeout(()=>{
        this.toastService.updateSuccess(false);
      }, 2500);
    });
  
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
