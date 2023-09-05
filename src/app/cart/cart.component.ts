import { Component, OnInit } from '@angular/core';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{

  cart!: Cart

  constructor(private cartService: CartService, private authService: AuthService){}

  ngOnInit(): void {
    this.authService.handleCart();
    this.cart = this.cartService.getCart();
    console.log(this.cart );
  }

}
