import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class SuccessView extends Component<HTMLElement> {
    protected _total: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    private _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._events = events;

        this._total = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._closeButton.addEventListener('click', () => {
            this._events.emit(AppEvents.MODAL_CLOSE);
        });
    }

    setTotal(total: number): void {
        if (this._total) {
            this._total.textContent = `Списано ${total} синапсов`;
        }
    }
}

export function createSuccessView(events: IEvents): SuccessView {
    const template = cloneTemplate<HTMLElement>('#success');
    return new SuccessView(template, events);
}