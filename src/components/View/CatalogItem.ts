import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types';

export class CatalogItem extends Card<IProduct> {
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    private _events: IEvents;
    private _product: IProduct;

    constructor(container: HTMLElement, product: IProduct, events: IEvents) {
        super(container);
        this._events = events;
        this._product = product;

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


        container.addEventListener('click', () => {
            this._events.emit('card:click', this._product);
        });
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

    render(data?: Partial<IProduct>): HTMLElement {
        const productData = data || this._product;
        
        if (productData.title) this.setTitle(productData.title);
        if (productData.category) this.setCategory(productData.category);
        if (productData.price !== undefined) this.setPrice(productData.price);
        if (productData.image) this.setCardImage(productData.image, productData.title);
        if (productData.description && this._description) {
            this.setDescription(productData.description);
        }
        
        return this.container;
    }
}


export function createCatalogItem(product: IProduct, events: IEvents): CatalogItem {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const container = template.content.cloneNode(true) as HTMLElement;
    return new CatalogItem(container.firstElementChild as HTMLElement, product, events);
}
