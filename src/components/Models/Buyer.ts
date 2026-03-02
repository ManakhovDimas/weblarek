
import { IEvents } from '../base/Events';
import { IBuyer, ValidationErrors } from '../../types';

export class Buyer {
    private _data: Partial<IBuyer>;
    private _events: IEvents;

    constructor(events: IEvents, initialData: Partial<IBuyer> = {}) {
        this._events = events;
        this._data = initialData;
    }

 
    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
        this._events.emit('form:update');
    }

    getData(): Partial<IBuyer> {
        return { ...this._data };
    }


    validateStep1(): boolean {
        return Boolean(this._data.payment) && Boolean(this._data.address?.trim());
    }


    validateStep2(): boolean {
        return Boolean(this._data.email?.trim()) && Boolean(this._data.phone?.trim());
    }

      validateData(): ValidationErrors<IBuyer> { 
    const errors: ValidationErrors<IBuyer> = {}; 
 

        if (!this._data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this._data.address?.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this._data.email?.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this._data.phone?.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }


    clearData(): void {
        this._data = {};
        this._events.emit('form:update');
    }
}
