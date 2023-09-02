import { Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private userSub!: Subscription;
  isAuthenticated = false;
  role = "member";
  username = "";

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.username = account.username;
        if(account.role == "admin")
          this.role = "admin"
        else
          this.role = "member"
        
      }
    })
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
  
  onLogout(){
    this.authService.logout();
  }
}
