import { Category } from "../manage-category/category.model";

export class Product {
    constructor(
        public id: number, public name: string, public description: string, public price: number, 
        public amount: number, public category: Category, public file: String
    ){}
}