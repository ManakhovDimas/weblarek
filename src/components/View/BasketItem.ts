import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketItem extends Component<HTMLElement> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    private _events: IEvents;
    private _productId!: string;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._events = events;

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

      
        this._deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            this._events.emit('cart:remove', { id: this._productId,fromBasket: true });
        });
    }

    setProductId(id: string): void {
        this._productId = id;
    }

    setIndex(index: number): void {
        if (this._index) {
            this._index.textContent = index.toString();
        }
    }

    setTitle(title: string): void {
        if (this._title) {
            this._title.textContent = title;
        }
    }

    setPrice(price: number): void {
        if (this._price) {
            this._price.textContent = `${price} синапсов`;
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createBasketItem(item: IProduct, index: number, events: IEvents): BasketItem {
    const template = cloneTemplate<HTMLElement>('#card-basket');
    const basketItem = new BasketItem(template, events);
    
    basketItem.setProductId(item.id);
    basketItem.setIndex(index);
    basketItem.setTitle(item.title);
    basketItem.setPrice(item.price || 0);
    
    return basketItem;
}
