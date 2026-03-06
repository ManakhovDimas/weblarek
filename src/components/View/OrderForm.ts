import { Form } from './Form';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IBuyer, ValidationErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

interface IOrderFormActions {
    onPaymentChange: (payment: TPayment) => void;
    onAddressChange: (address: string) => void;
    onSubmit: () => void;
}

export class OrderForm extends Form<IOrderFormActions> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IOrderFormActions) {
        super(container);
        
        this._paymentButtons = container.querySelectorAll('button[name]') as NodeListOf<HTMLButtonElement>;
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.setPaymentMethod(payment);
                if (actions?.onPaymentChange) {
                    actions.onPaymentChange(payment);
                }
            });
        });
        
        this._addressInput.addEventListener('input', () => {
            if (actions?.onAddressChange) {
                actions.onAddressChange(this._addressInput.value);
            }
        });
        
        super.setupSubmitHandler(() => {
            if (actions?.onSubmit) {
                actions.onSubmit();
            }
        });
    }

    setPaymentMethod(method: TPayment): void {
        
        this._paymentButtons.forEach(button => {
            if (button.name === method) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    setAddress(address: string): void {
        this._addressInput.value = address;
    }

    setValidationErrors(errors: ValidationErrors<IBuyer>): void {
        this.setErrors(errors);
    }

    setSubmitButtonEnabled(enabled: boolean): void {
        super.setSubmitButtonEnabled(enabled);
        if (enabled) {
            this._submitButton.classList.remove('button_disabled');
        } else {
            this._submitButton.classList.add('button_disabled');
        }
    }
}

export function createOrderForm(events: IEvents): OrderForm {
    const template = cloneTemplate<HTMLElement>('#order');
    
    const actions: IOrderFormActions = {
        onPaymentChange: (payment: TPayment) => {
            events.emit('payment:change', { payment });
        },
        onAddressChange: (address: string) => {
            events.emit('address:change', { address });
        },
        onSubmit: () => {
            events.emit('order:submit');
        }
    };
    
    return new OrderForm(template, actions);
}