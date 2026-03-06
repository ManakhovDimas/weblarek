import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errorsElement = ensureElement<HTMLElement>('.form__errors', container);
    }

    protected setErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        
        if (errorMessages.length > 0) {
            this._errorsElement.textContent = errorMessages.join(', ');
            this._errorsElement.style.display = 'block';
        } else {
            this._errorsElement.style.display = 'none';
        }
    }

    protected setSubmitButtonEnabled(enabled: boolean): void {
        this._submitButton.disabled = !enabled;
    }

    protected setupSubmitHandler(callback?: () => void): void {
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (callback && !this._submitButton.disabled) {
                callback();
            }
        });
    }
}