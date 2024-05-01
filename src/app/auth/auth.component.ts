import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { CartService } from '../cart/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false 
  error: string = ""
  isLogged = false
  // @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective

  constructor(private authService: AuthService, private router: Router,  private cartService: CartService, private http: HttpClient){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm){
    if(!form.valid)
      return;
    const username = form.value.username;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;

    if(this.isLoginMode){
      authObs = this.authService.login(username, password);
    }
    else{
      authObs = this.authService.signUp(username, password);
    }

    authObs.subscribe({
      next: (response)=>{
        console.log(response);
        this.isLoading = false;
        this.isLogged = true;
        this.router.navigate(["/products"]);
      }, 
      error: (errorMessage)=>{
        console.log(errorMessage);
        this.error = errorMessage;
        // this.showErrorAlert(errorMessage)
        this.isLoading = false;
      }
    })
    form.reset();
  }

  onHandleError(){
    this.error = null!;
  }

  // private showErrorAlert(errorMessage: string){
  //   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
  //   const hostViewContainerRef = this.alertHost.viewContainerRef
  //   hostViewContainerRef.clear()
  //   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory)
  //   componentRef.instance.message = errorMessage
  //   componentRef.instance.close.subscribe(()=>{
      
  //   })
  // }
}
