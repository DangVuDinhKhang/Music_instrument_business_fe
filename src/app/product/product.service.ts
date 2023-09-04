import { Injectable } from "@angular/core";
import { Product } from "./product.model";

@Injectable({providedIn: "root"})
export class ProductService{
    
    public needUpdateProduct!: Product;

    setNeedUpdateProduct(product: Product){
        this.needUpdateProduct = product;
    }


}