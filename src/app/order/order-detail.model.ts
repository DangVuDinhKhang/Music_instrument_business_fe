import { Order } from "../manage-order/order.model";
import { Product } from "../product/product.model";

export class OrderDetail{
    constructor(
        public id: number, public amount: number, public total: number, public product: Product, public order: Order 
    ){}
}