import { Account } from "../auth/account.model";
import { Product } from "../product/product.model";
import { ProductAndQuantity } from "../product/productAndQuantity.model";

export class Cart {

    // public id!: number;
    // public productsAndQuantity!: ProductAndQuantity[];
    // public account!: number;

    // constructor(){}

    constructor(public id: number, public productsAndQuantity: ProductAndQuantity[], public account: number){}
}