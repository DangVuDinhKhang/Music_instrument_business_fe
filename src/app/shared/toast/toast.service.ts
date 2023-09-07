import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToastService {
  success: boolean = false;
  message!: string | null;

  updateSuccess(value: boolean) {
    this.success = value;
  }

  updateMessage(message: string) {
    this.message = message;
  }
}
