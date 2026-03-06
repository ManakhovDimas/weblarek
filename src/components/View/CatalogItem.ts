import { Card } from './Card';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types';

interface CatalogItemActions {
    onClick: () => void;
}

export class CatalogItem extends Card<IProduct> {
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement, actions?: CatalogItemActions) {
        super(container);
        
        const imageElement = container.querySelector('.card__image');
        if (imageElement) {
            this._image = imageElement as HTMLImageElement;
        }

        const categoryElement = container.querySelector('.card__category');
        if (categoryElement) {
            this._category = categoryElement as HTMLElement;
        }

        const descriptionElement = container.querySelector('.card__text');
        if (descriptionElement) {
            this._description = descriptionElement as HTMLElement;
        }

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    setCardImage(src: string, alt?: string): void {
        if (this._image) {
            this._image.src = src;
            if (alt) {
                this._image.alt = alt;
            }
        }
    }

    setCategory(category: string): void {
        if (this._category) {
            this.setText(this._category, category);
            const categoryClass = categoryMap[category as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = 'card__category ' + categoryClass;
        }
    }

    setDescription(description: string): void {
        if (this._description) {
            this.setText(this._description, description);
        }
    }
}

export function createCatalogItem(product: IProduct, onClick: () => void): CatalogItem {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const container = template.content.cloneNode(true) as HTMLElement;
    
    const catalogItem = new CatalogItem(
        container.firstElementChild as HTMLElement,
        { onClick }
    );
    
    catalogItem.setTitle(product.title);
    catalogItem.setCategory(product.category);
    catalogItem.setPrice(product.price);
    catalogItem.setCardImage(product.image, product.title);
    catalogItem.setDescription(product.description);
    
    return catalogItem;
}