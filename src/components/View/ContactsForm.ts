import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IBuyer, ValidationErrors } from '../../types';

interface IContactsFormActions {
    onEmailChange: (email: string) => void;
    onPhoneChange: (phone: string) => void;
    onSubmit: () => void;
}

export class ContactsForm extends Component<IContactsFormActions> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorsElement: HTMLElement;

    constructor(container: HTMLElement, actions?: IContactsFormActions) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', container);
        
        this._emailInput.addEventListener('input', () => {
            if (actions?.onEmailChange) {
                actions.onEmailChange(this._emailInput.value);
            }
            this.validateForm();
        });
        
        this._phoneInput.addEventListener('input', () => {
            if (actions?.onPhoneChange) {
                actions.onPhoneChange(this._phoneInput.value);
            }
            this.validateForm();
        });
        
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (actions?.onSubmit && this._submitButton.disabled === false) {
                actions.onSubmit();
            }
        });
        
        this.validateForm();
    }

    setEmail(email: string): void {
        this._emailInput.value = email;
        this.validateForm();
    }

    setPhone(phone: string): void {
        this._phoneInput.value = phone;
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
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }

    private validateForm(): void {
        const isValid = this._emailInput.value.trim() !== '' && 
                       this._phoneInput.value.trim() !== '';
        this._submitButton.disabled = !isValid;
    }

    render(): HTMLElement {
        return this.container;
    }
}

export function createContactsForm(actions?: IContactsFormActions): ContactsForm {
    const template = cloneTemplate<HTMLElement>('#contacts');
    return new ContactsForm(template, actions);
}
