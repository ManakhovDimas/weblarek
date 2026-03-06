import { Form } from './Form';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IBuyer, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

interface IContactsFormActions {
    onEmailChange: (email: string) => void;
    onPhoneChange: (phone: string) => void;
    onSubmit: () => void;
}

export class ContactsForm extends Form<IContactsFormActions> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IContactsFormActions) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        
        this._emailInput.addEventListener('input', () => {
            if (actions?.onEmailChange) {
                actions.onEmailChange(this._emailInput.value);
            }
        });
        
        this._phoneInput.addEventListener('input', () => {
            if (actions?.onPhoneChange) {
                actions.onPhoneChange(this._phoneInput.value);
            }
        });
        
        super.setupSubmitHandler(() => {
            if (actions?.onSubmit) {
                actions.onSubmit();
            }
        });
    }

    setEmail(email: string): void {
        this._emailInput.value = email;
    }

    setPhone(phone: string): void {
        this._phoneInput.value = phone;
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

export function createContactsForm(events: IEvents): ContactsForm {
    const template = cloneTemplate<HTMLElement>('#contacts');
    
    const actions: IContactsFormActions = {
        onEmailChange: (email: string) => {
            events.emit('email:change', { email });
        },
        onPhoneChange: (phone: string) => {
            events.emit('phone:change', { phone });
        },
        onSubmit: () => {
            events.emit('contacts:submit');
        }
    };
    
    return new ContactsForm(template, actions);
}