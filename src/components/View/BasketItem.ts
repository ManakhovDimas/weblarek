import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

interface IBasketItemActions {
    onDelete: () => void;
}

export class BasketItem extends Component<IBasketItemActions> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketItemActions) {
        super(container);
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        if (actions?.onDelete) {
            this._deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                actions.onDelete();
            });
        }
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


export function createBasketItem(item: IProduct, index: number, actions?: IBasketItemActions): BasketItem {
    const template = cloneTemplate<HTMLElement>('#card-basket');
    const basketItem = new BasketItem(template, actions);
    
    basketItem.setIndex(index);
    basketItem.setTitle(item.title);
    basketItem.setPrice(item.price || 0);
    
    return basketItem;
}