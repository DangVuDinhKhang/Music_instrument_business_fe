import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-role',
  templateUrl: './form-role.component.html',
  styleUrls: ['./form-role.component.scss']
})
export class FormRoleComponent implements OnInit{

  role!: string;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.role = this.authService.needToUpdateAccount.role;
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });
    
    this.http.put<any>(`http://localhost:8080/api/account/${this.authService.needToUpdateAccount.id}`, {role: this.role}, {headers}).subscribe((responseData)=>{
      console.log(responseData);
      this.router.navigate(["/manage/accounts"]);
    });
    
  }
}
