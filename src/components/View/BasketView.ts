import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { BasketItem, createBasketItem } from './BasketItem';

interface IBasketViewActions {
    onOrder: () => void;
    onDeleteItem: (item: IProduct) => void;
}

export class BasketView extends Component<IBasketViewActions> {
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _orderButton: HTMLButtonElement;
    protected _emptyMessage: HTMLElement;
    private _items: BasketItem[] = [];
    private _onDeleteItem?: (item: IProduct) => void;

    constructor(container: HTMLElement, actions?: IBasketViewActions) {
        super(container);
        
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', container);
        this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        
       
        if (actions?.onDeleteItem) {
            this._onDeleteItem = actions.onDeleteItem;
        }
        
        
        this._emptyMessage = document.createElement('p');
        this._emptyMessage.textContent = 'Корзина пуста';
        this._emptyMessage.className = 'basket__empty';
        
        if (actions?.onOrder) {
            this._orderButton.addEventListener('click', actions.onOrder);
        }
    }

    setItems(items: IProduct[]): void {
        this._items = [];
        this._list.innerHTML = '';
        
        if (items.length === 0) {
            this.renderEmpty();
            return;
        }
        
        items.forEach((item, index) => {
            const basketItem = createBasketItem(item, index + 1, {
                onDelete: () => {
                   
                    if (this._onDeleteItem) {
                        this._onDeleteItem(item);
                    }
                }
            });
            this._items.push(basketItem);
            this._list.appendChild(basketItem.render());
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
        this._list.appendChild(this._emptyMessage);
        this.setTotalPrice(0);
        this.setOrderButtonEnabled(false);
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createBasketView(actions?: IBasketViewActions): BasketView {
    const template = cloneTemplate<HTMLElement>('#basket');
    return new BasketView(template, actions);
}