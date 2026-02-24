import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IBuyer, ValidationErrors, TPayment } from '../../types';

interface IOrderFormActions {
    onPaymentChange: (payment: TPayment) => void;
    onAddressChange: (address: string) => void;
    onSubmit: () => void;
}

export class OrderForm extends Component<IOrderFormActions> {
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _addressInput: HTMLInputElement;
    protected _nextButton: HTMLButtonElement;
    protected _errorsElement: HTMLElement;
    private _selectedPayment: TPayment = '';

    constructor(container: HTMLElement, actions?: IOrderFormActions) {
        super(container);
        
        this._paymentButtons = container.querySelectorAll('button[name]') as NodeListOf<HTMLButtonElement>;
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._nextButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', container);
        
      
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
            this.validateForm();
        });
        
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (actions?.onSubmit && this._nextButton.disabled === false) {
                actions.onSubmit();
            }
        });
        
        this.validateForm();
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
        
        this.validateForm();
    }

    setAddress(address: string): void {
        this._addressInput.value = address;
        this.validateForm();
    }

    setErrors(errors: ValidationErrors<IBuyer>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        
        if (errorMessages.length > 0) {
            this._errorsElement.textContent = errorMessages.join(', ');
            this._errorsElement.style.display = 'block';
        } else {
            this._errorsElement.style.display = 'none';
        }
        
        this.validateForm();
    }

    getData(): Partial<IBuyer> {
        return {
            payment: this._selectedPayment,
            address: this._addressInput.value
        };
    }

    private validateForm(): void {
        const isValid = this._selectedPayment !== '' && 
                       this._addressInput.value.trim() !== '';
        this._nextButton.disabled = !isValid;
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createOrderForm(actions?: IOrderFormActions): OrderForm {
    const template = cloneTemplate<HTMLElement>('#order');
    return new OrderForm(template, actions); 
}
