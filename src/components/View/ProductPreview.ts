import { Card } from './Card';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductPreview extends Card<IProduct> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    private _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._events = events;
        
        this._description = this.container.querySelector('.card__text') as HTMLElement;
        this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        
        if (this._button) {
            this._button.addEventListener('click', () => {
                this._events.emit('preview:toggle');
            });
        }
    }

    setDescription(description: string): void {
        this.setText(this._description, description);
    }

    setCardImage(src: string, alt?: string): void {
        if (this._image) {
            this._image.src = src;
            if (alt) {
                this._image.alt = alt;
            }
        }
    }

    setButtonText(text: string): void {
        if (this._button) {
            this._button.textContent = text;
        }
    }

    setButtonDisabled(disabled: boolean): void {
        if (this._button) {
            this._button.disabled = disabled;
        }
    }

    setCategory(category: string): void {
        if (this._category) {
            this.setText(this._category, category);
        }
    }

    updateProductData(data: IProduct, isInCart: boolean): void {
        if (data.title) this.setTitle(data.title);
        if (data.category) this.setCategory(data.category);
        if (data.price !== undefined) this.setPrice(data.price);
        if (data.image) this.setCardImage(data.image, data.title);
        if (data.description) this.setDescription(data.description);
        
        if (data.price === null) {
            this.setButtonText('Недоступно');
            this.setButtonDisabled(true);
        } else {
            this.setButtonDisabled(false);
            this.setButtonText(isInCart ? 'Удалить из корзины' : 'В корзину');
        }
    }
}

let previewInstance: ProductPreview | null = null;

export function getProductPreview(events: IEvents): ProductPreview {
    if (!previewInstance) {
        const template = cloneTemplate<HTMLElement>('#card-preview');
        previewInstance = new ProductPreview(template, events);
    }
    return previewInstance;
}