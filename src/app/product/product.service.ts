import { Injectable } from "@angular/core";
import { Product } from "./product.model";

@Injectable({providedIn: "root"})
export class ProductService{
    
    // private products: Product[] = [];

    // constructor(){}
    
    // getProducts(){
    //     return this.products.slice();
    // }

    // getProductById(productId: number){
    //     let product = this.products.find(product => product.id == productId);
    //     console.log(product)
    //     return product;
    // }

    // setProducts(products: Product[]){
    //     this.products = products
    //     // this.recipesChanged.next(this.recipes.slice())
    // }


}