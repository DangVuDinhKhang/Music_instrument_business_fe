import { Product } from "../product/product.model";

export class File {
    constructor(public id: number, public path: string, public product: Product){}
}