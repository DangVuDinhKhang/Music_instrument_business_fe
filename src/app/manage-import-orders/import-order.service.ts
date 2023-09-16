import { Supplier } from "../manage-supplier/supplier.model";

export class ImportOrderService {
    
    constructor(
        public id: number, public date: Date, public total: number, public status: boolean, 
        public note: string, public supplier: Supplier
    ){}
}