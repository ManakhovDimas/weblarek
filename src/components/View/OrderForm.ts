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
    private _selectedPayment: TPayment = '';
    private _isInitialized: boolean = false;

    constructor(container: HTMLElement, actions?: IOrderFormActions) {
        super(container);
        
        this._paymentButtons = container.querySelectorAll('button[name]') as NodeListOf<HTMLButtonElement>;
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        
        if (!this._isInitialized) {
            this.setupPaymentHandlers(actions);
            this.setupAddressHandler(actions);
            
            super.setupSubmitHandler(() => {
                if (actions?.onSubmit) {
                    actions.onSubmit();
                }
            });
            
            this._isInitialized = true;
        }
        
        this.validate();
    }

    private setupPaymentHandlers(actions?: IOrderFormActions): void {
        this._paymentButtons.forEach(button => {
            const newButton = button.cloneNode(true) as HTMLButtonElement;
            button.parentNode?.replaceChild(newButton, button);
        });
        
        this._paymentButtons = this.container.querySelectorAll('button[name]') as NodeListOf<HTMLButtonElement>;
        
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.setPaymentMethod(payment);
                if (actions?.onPaymentChange) {
                    actions.onPaymentChange(payment);
                }
            });
        });
    }

    private setupAddressHandler(actions?: IOrderFormActions): void {
        const oldInput = this._addressInput;
        const newInput = oldInput.cloneNode(true) as HTMLInputElement;
        oldInput.parentNode?.replaceChild(newInput, oldInput);
        
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        

        this._addressInput.addEventListener('input', () => {
            if (actions?.onAddressChange) {
                actions.onAddressChange(this._addressInput.value);
            }
            this.validate();
        });
    }

    setPaymentMethod(method: TPayment): void {
        this._selectedPayment = method;
        
        this._paymentButtons.forEach(button => {
            if (button.name === method) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
        
        this.validate();
    }

    setAddress(address: string): void {
        this._addressInput.value = address;
        this.validate();
    }

    setValidationErrors(errors: ValidationErrors<IBuyer>): void {
        this.setErrors(errors);
        this.validate();
    }

    setValid(isValid: boolean): void {
        this.setSubmitButtonEnabled(isValid);
    }

    protected validate(): boolean {
        const address = this._addressInput.value.trim();
        const isValid = this._selectedPayment !== '' && address !== '';
        
        this.setSubmitButtonEnabled(isValid);
        return isValid;
    }

    protected setSubmitButtonEnabled(enabled: boolean): void {
        super.setSubmitButtonEnabled(enabled);
        if (enabled) {
            this._submitButton.classList.remove('button_disabled');
        } else {
            this._submitButton.classList.add('button_disabled');
        }
    }

    render(): HTMLElement {
        return this.container;
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