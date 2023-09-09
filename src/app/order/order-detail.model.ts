import { Order } from "../manage-order/order.model";
import { Product } from "../product/product.model";

export class OrderDetail{
    constructor(
        public id: number, public quantity: number, public total: number, public product: Product, public customerOrder: Order 
    ){}
}