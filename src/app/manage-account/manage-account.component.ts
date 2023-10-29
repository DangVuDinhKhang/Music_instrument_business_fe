import { Component } from '@angular/core';
import { Account } from '../auth/account.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent {
  accounts: Account[] = [];
  needToDeleteAccount!: Account;

  constructor(private http: HttpClient, private authService: AuthService, private modalService: NgbModal, private router: Router){}

  ngOnInit() {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.getAccounts();
  }

  getAccounts(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.get<Account[]>(`http://localhost:8080/api/account`, {headers}).subscribe((responseData) => {
        this.accounts = responseData;
    })
  }

  onUpdate(account: Account){
    this.authService.setNeedUpdateAccount(account);
    this.router.navigate(['/manage/accounts/update', account.id] );
  }

  open(modal: any, account: Account){
    
    this.modalService.open(modal);
    this.needToDeleteAccount = account;
  }

  onDelete(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    // this.http.put<Account>(`http://localhost:8080/api/account/${this.needToDeleteAccountId}`, {headers}).subscribe((responseData) => {
    //   this.accounts = this.accounts.filter(account => account.id != this.needToDeleteAccountId);
    //   this.modalService.dismissAll();
    //   this.needToDeleteAccountId = 0;
    // })
    this.http.put<any>(`http://localhost:8080/api/account/update-status/${this.needToDeleteAccount.id}`,{}, {headers}).subscribe((responseData)=>{
      console.log(responseData);
      this.modalService.dismissAll();
      this.accounts.map((account) => {
        if(account.id == this.needToDeleteAccount.id)
          account.status = account.status == 1 ? 0 : 1;
      });
    });
  }
}
