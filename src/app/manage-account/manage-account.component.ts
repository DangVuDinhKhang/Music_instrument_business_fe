import { Component } from '@angular/core';
import { Account } from '../auth/account.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent {
  accounts: Account[] = [];

  constructor(private http: HttpClient, private authService: AuthService){}

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    this.http.get<Account[]>(`http://localhost:8080/api/account`, {headers}).subscribe((responseData) => {
        this.accounts = responseData;
    })
  }
}
