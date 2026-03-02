import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';


export interface ICardData {
    title: string;
    price: number | null;
}

export abstract class Card<T extends ICardData = ICardData> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    setTitle(title: string): void {
        this.setText(this._title, title);
    }

    setPrice(price: number | null): void {
        if (price === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${price} синапсов`);
        }
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

}
