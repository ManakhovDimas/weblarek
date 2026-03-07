import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../utils/constants';

export class Header extends Component<HTMLElement> {
    protected _basketButton: HTMLButtonElement;
    protected _basketCounter: HTMLElement;
    private _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._events = events;

        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);

   
        this._basketButton.addEventListener('click', () => {
            this._events.emit(AppEvents.BASKET_OPEN);
        });
    }

    setCounter(count: number): void {
        this._basketCounter.textContent = count.toString();
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createHeader(events: IEvents): Header {
    const headerElement = ensureElement<HTMLElement>('.header');
    return new Header(headerElement, events);
}
