import { Injectable } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class ProductService{
    
    public needUpdateProduct!: Product;

    searchProduct: Product[] = []

    constructor(private http: HttpClient){}

    setNeedUpdateProduct(product: Product){
        this.needUpdateProduct = product;
    }

    setSearchProduct(searchProduct: Product[]){
      this.searchProduct = searchProduct;
    }

    addToCart(productId: number, cartId: number){
      this.http.put<any>(`http://localhost:8080/api/product/add-to-cart`, {productId: productId, cartId: cartId}).subscribe(
        (responseData)=>{
          console.log(responseData);
        },
        (error)=>{
          console.error('Lỗi:', error);
        }
      );
    }

    updateInCart(productId: number, cartId: number, quantity: number){
        this.http.put<any>(`http://localhost:8080/api/product/update-in-cart`, {productId: productId, cartId: cartId, quantity: quantity}).subscribe((responseData)=>{
          console.log(responseData)
        })
    }

    removeFromCart(productId: number, cartId: number){
        this.http.delete<any>(`http://localhost:8080/api/product/remove-from-cart/${productId}/${cartId}`).subscribe((responseData)=>{
          console.log(responseData)
        })
    }


}