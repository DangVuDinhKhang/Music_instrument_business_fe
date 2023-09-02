import { Injectable } from "@angular/core";
import { Category } from "./category.model";

@Injectable({providedIn: "root"})
export class CategoryService{
    
    public needUpdateCategory!: Category;

    setNeedUpdateCategory(category: Category){
        this.needUpdateCategory = category;
    }


}