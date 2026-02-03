// src/components/Models/Buyer.ts
import { IBuyer, TPayment, ValidationErrors } from '../../types';

export class Buyer {
  private payment: TPayment  = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';


  constructor(data: Partial<IBuyer> = {}) {
    this.payment = data.payment || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearData(): void {    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validateData(): ValidationErrors<IBuyer> {
    const errors: ValidationErrors<IBuyer> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}
