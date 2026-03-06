import { IEvents } from '../base/Events';
import { IBuyer, ValidationErrors } from '../../types';

export class Buyer {
    private _data: IBuyer;
    private _events: IEvents;
    

    constructor(events: IEvents, initialData: Partial<IBuyer> = {}) {
        this._events = events;
        this._data = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            ...initialData
        };
    }

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
        this._events.emit('form:update');
    }

    getData(): IBuyer {
        return { ...this._data };
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
        this._data = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
        this._events.emit('form:update');
    }
}