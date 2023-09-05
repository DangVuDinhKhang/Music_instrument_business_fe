import { Account } from "../auth/account.model";
import { Product } from "../product/product.model";

export class Cart {

    public id!: number;
    public amount!: number;
    public products!: Product[];
    public account!: number;

    constructor(){}
}