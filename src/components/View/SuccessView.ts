import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';

interface ISuccessViewActions {
    onClose: () => void;
}

export class SuccessView extends Component<ISuccessViewActions> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessViewActions) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.order-success__title', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        
        if (actions?.onClose) {
            this._closeButton.addEventListener('click', actions.onClose);
        }
    }

    setTotal(total: number): void {
      
        if (this._description) {
            this._description.textContent = `Списано ${total} синапсов`;
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createSuccessView(actions?: ISuccessViewActions): SuccessView {
    const template = cloneTemplate<HTMLElement>('#success');
    return new SuccessView(template, actions);
}