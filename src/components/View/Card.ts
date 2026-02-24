import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);


        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);


        const imageElement = container.querySelector('.card__image');
        if (imageElement) {
            this._image = imageElement as HTMLImageElement;
        }


        const categoryElement = container.querySelector('.card__category');
        if (categoryElement) {
            this._category = categoryElement as HTMLElement;
        }


        const button = container.querySelector('.card__button');
        if (button) {
            this._button = button as HTMLButtonElement;
        }
    }

    protected setCardImage(src: string, alt?: string | undefined): void {
        if (this._image) {
            super.setImage(this._image, src, alt);
        }
    }

    protected setTitle(title: string): void {
        this.setText(this._title, title);
    }

    protected setCategory(category: string): void {
        if (this._category) {
            this.setText(this._category, category);

            const categoryClass = categoryMap[category as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = 'card__category ' + categoryClass;
        }
    }

    protected setPrice(price: number | null): void {
        if (price === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${price} синапсов`);
        }
    }

    protected setButtonText(text: string): void {
        if (this._button) {
            this.setText(this._button, text);
        }
    }

    protected setButtonDisabled(disabled: boolean): void {
        if (this._button) {
            this._button.disabled = disabled;
        }
    }

    protected setButtonHandler(handler: () => void): void {
        if (this._button) {
            this._button.addEventListener('click', handler);
        }
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}