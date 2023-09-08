import { Account } from "../auth/account.model";
import { Payment } from "../manage-payment/payment.model";

export class Order {
    constructor(
        public id: number, public date: Date, public total: number, public phone: string, public address: string, 
        public payment: Payment, public account: Account, public status: boolean
    ){}
}