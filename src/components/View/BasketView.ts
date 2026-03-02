import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class BasketView extends Component<HTMLElement> {
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _orderButton: HTMLButtonElement;
    private _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._events = events;

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);
        this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);


        this._orderButton.addEventListener('click', () => {
            this._events.emit('order:open');
        });
    }


    setItems(items: HTMLElement[]): void {
        this._list.innerHTML = '';

        if (items.length === 0) {
            this.renderEmpty();
            return;
        }

        this._list.classList.remove('basket__list--empty');
        items.forEach(item => {
            this._list.appendChild(item);
        });
    }

    setTotalPrice(price: number): void {
        if (this._totalPrice) {
            this._totalPrice.textContent = `${price} синапсов`;
        }
    }

    setOrderButtonEnabled(enabled: boolean): void {
        this._orderButton.disabled = !enabled;
    }

    renderEmpty(): void {
        this._list.innerHTML = '';
        this._list.classList.add('basket__list--empty');
        this.setTotalPrice(0);
        this.setOrderButtonEnabled(false);
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createBasketView(events: IEvents): BasketView {
    const template = cloneTemplate<HTMLElement>('#basket');
    return new BasketView(template, events);
}
