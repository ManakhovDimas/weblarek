import { Card } from './Card';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';

interface IProductPreviewActions {
    onAddToCart: () => void;
    onRemoveFromCart: () => void;
}

export class ProductPreview extends Card<IProduct> {
    protected _description: HTMLElement;
    private _isInCart: boolean = false;
    private _actions?: IProductPreviewActions;

    constructor(container: HTMLElement, actions?: IProductPreviewActions) {
        super(container);
        this._actions = actions;
        
        this._description = this.container.querySelector('.card__text') as HTMLElement;
        
        if (this._button) {
            this._button.addEventListener('click', this.handleButtonClick.bind(this));
        }
    }

    setInCart(value: boolean): void {
        this._isInCart = value;
        this.updateButton();
    }

    setDescription(description: string): void {
        this.setText(this._description, description);
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title) this.setTitle(data.title);
            if (data.category) this.setCategory(data.category);
            if (data.price !== undefined) this.setPrice(data.price);
            if (data.image) this.setCardImage(data.image, data.title);
            if (data.description) this.setDescription(data.description);
            
           
            if (data.price === null) {
                this.setButtonText('Недоступно');
                this.setButtonDisabled(true);
            } else {
                this.updateButton();
            }
        }
        return this.container;
    }

    private updateButton(): void {
        if (this._button && this._button.disabled === false) {
            if (this._isInCart) {
                this.setButtonText('Удалить из корзины');
            } else {
                this.setButtonText('В корзину');
            }
        }
    }

    private handleButtonClick(): void {
        if (this._isInCart && this._actions?.onRemoveFromCart) {
            this._actions.onRemoveFromCart();
        } else if (!this._isInCart && this._actions?.onAddToCart) {
            this._actions.onAddToCart();
        }
    }
}


export function createProductPreview(data: IProduct, isInCart: boolean, actions?: IProductPreviewActions): ProductPreview {
    const template = cloneTemplate<HTMLElement>('#card-preview');
    const preview = new ProductPreview(template, actions);
    preview.setInCart(isInCart);
    preview.render(data);
    return preview; 
}
