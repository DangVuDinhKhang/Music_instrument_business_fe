import { Account } from "../auth/account.model";

export class ImportOrder {
    constructor(
        public id: number, public date: Date, public total: number, public account: Account, public status: number
    ){}
}