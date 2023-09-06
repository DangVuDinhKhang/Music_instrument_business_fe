import { Category } from "../manage-category/category.model";
import {File} from '../shared/file.model'

export class Product {
    constructor(
        public id: number, public name: string, public description: string, public price: number, 
        public quantity: number, public category: Category, public file: string[]
    ){}
}