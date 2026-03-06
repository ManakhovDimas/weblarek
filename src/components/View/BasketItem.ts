import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

interface BasketItemActions {
    onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Card<IProduct> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: BasketItemActions) {
        super(container);
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    setIndex(index: number): void {
        this.setText(this._index, index.toString());
    }
}

export function createBasketItem(item: IProduct, index: number, onClick: () => void): BasketItem {
    const template = document.querySelector('#card-basket') as HTMLTemplateElement;
    const container = template.content.cloneNode(true) as HTMLElement;
    
    const basketItem = new BasketItem(
        container.firstElementChild as HTMLElement,
        {
            onClick: (event: MouseEvent) => {
                event.preventDefault();
                onClick();
            }
        }
    );
    
    basketItem.setTitle(item.title);
    basketItem.setPrice(item.price);
    basketItem.setIndex(index);
    
    return basketItem;
}