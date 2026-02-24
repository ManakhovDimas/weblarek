import { Card } from './Card';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';

interface ICatalogItemActions {
    onClick: (event: MouseEvent) => void;
}

export class CatalogItem extends Card<IProduct> {
    constructor(container: HTMLElement, actions?: ICatalogItemActions) {
        super(container);
        
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title) this.setTitle(data.title);
            if (data.category) this.setCategory(data.category);
            if (data.price !== undefined) this.setPrice(data.price);
            if (data.image) this.setCardImage(data.image, data.title);
        }
        return this.container;
    }
}

export function createCatalogItem(data: IProduct, actions?: ICatalogItemActions): CatalogItem {
    const template = cloneTemplate<HTMLElement>('#card-catalog');
    const item = new CatalogItem(template, actions);
    item.render(data);
    return item; 
}
