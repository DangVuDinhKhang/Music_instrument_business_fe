import { Injectable } from "@angular/core";
import { Supplier } from "./supplier.model";

@Injectable({providedIn: "root"})
export class SupplierService {

    public needUpdateSupplier!: Supplier;

    setNeedUpdateSupplier(supplier: Supplier){
        this.needUpdateSupplier = supplier;
    }
}