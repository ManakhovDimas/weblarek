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
    private _isInitialized: boolean = false;

    constructor(container: HTMLElement, actions?: IContactsFormActions) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        
      
        if (!this._isInitialized) {
            this.setupEmailHandler(actions);
            this.setupPhoneHandler(actions);
            
        
            super.setupSubmitHandler(() => {
                if (actions?.onSubmit) {
                    actions.onSubmit();
                }
            });
            
            this._isInitialized = true;
        }
        
        this.validate();
    }

    private setupEmailHandler(actions?: IContactsFormActions): void {
        const oldInput = this._emailInput;
        const newInput = oldInput.cloneNode(true) as HTMLInputElement;
        oldInput.parentNode?.replaceChild(newInput, oldInput);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        
        this._emailInput.addEventListener('input', () => {
            if (actions?.onEmailChange) {
                actions.onEmailChange(this._emailInput.value);
            }
            this.validate();
        });
    }

    private setupPhoneHandler(actions?: IContactsFormActions): void {
        const oldInput = this._phoneInput;
        const newInput = oldInput.cloneNode(true) as HTMLInputElement;
        oldInput.parentNode?.replaceChild(newInput, oldInput);
        
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        
        this._phoneInput.addEventListener('input', () => {
            if (actions?.onPhoneChange) {
                actions.onPhoneChange(this._phoneInput.value);
            }
            this.validate();
        });
    }

    setEmail(email: string): void {
        this._emailInput.value = email;
        this.validate();
    }

    setPhone(phone: string): void {
        this._phoneInput.value = phone;
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
        const email = this._emailInput.value.trim();
        const phone = this._phoneInput.value.trim();
        const isValid = email !== '' && phone !== '';
        
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