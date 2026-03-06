import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class SuccessView extends Component<HTMLElement> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    private _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._events = events;

        this._title = ensureElement<HTMLElement>('.order-success__title', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._closeButton.addEventListener('click', () => {
            this._events.emit('modal:close');
        });
    }

    setTotal(total: number): void {
        if (this._description) {
            this._description.textContent = `Списано ${total} синапсов`;
        }
    }
}

export function createSuccessView(events: IEvents): SuccessView {
    const template = cloneTemplate<HTMLElement>('#success');
    return new SuccessView(template, events);
}