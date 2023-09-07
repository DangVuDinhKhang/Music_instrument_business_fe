import { Cart } from "../cart/cart.model";

export class Account{

    public id: number;
    public username: string;
    public address!: string;
    public phone!: string;
    private _role: string;
    private _token: string;
    private _cart: Cart

    constructor(id: number, username: string, role: string, cart: Cart, token: string, phone: string, address: string){
        this.id = id;
        this.username = username; 
        this._token = token;
        this._cart = cart;
        this._role = role;
        this.phone = phone;
        this.address = address;
    }

    get role(): string {
        return this._role;
    }

    get token(): string {
        // if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
        //     return null
        return this._token;
    }

    get cart(): Cart {
        return this._cart;
    }

}