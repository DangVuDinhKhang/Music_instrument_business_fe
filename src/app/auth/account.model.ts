export class Account{

    public id: number;
    public username: string;
    public address!: string;
    public phone!: string;
    private _role: string;
    private _token: string;

    constructor(id: number, username: string, role: string, token: string){
        this.id = id;
        this.username = username; 
        this._token = token;
        this._role = role;
    }

    get role(): string {
        return this._role;
    }

    get token(): string{
        // if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
        //     return null
        return this._token
    }

}