// ProductPreview.ts
import { Card } from './Card';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';


interface IProductPreviewActions {
    onAddToCart: () => void;
    onRemoveFromCart: (productId: string) => void;
}


export class ProductPreview extends Card<IProduct> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    private _isInCart: boolean = false;
    private _actions?: IProductPreviewActions;
    private _productId?: string;


    constructor(container: HTMLElement, actions?: IProductPreviewActions) {
        super(container);
        this._actions = actions;
        
        this._description = this.container.querySelector('.card__text') as HTMLElement;
        this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
        
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


    setCardImage(src: string, alt?: string): void {
        const image = this.container.querySelector('.card__image') as HTMLImageElement;
        if (image) {
            image.src = src;
            if (alt) {
                image.alt = alt;
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
        const categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        if (categoryElement) {
            this.setText(categoryElement, category);
        }
    }


 
    updateProductData(data: IProduct, isInCart: boolean): void {
        this._productId = data.id;
        
        if (data.title) this.setTitle(data.title);
        if (data.category) this.setCategory(data.category);
        if (data.price !== undefined) this.setPrice(data.price);
        if (data.image) this.setCardImage(data.image, data.title);
        if (data.description) this.setDescription(data.description);
        
        this.setInCart(isInCart);
        
   
        if (data.price === null) {
            this.setButtonText('Недоступно');
            this.setButtonDisabled(true);
        } else {
            this.updateButton();
        }
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
        if (this._isInCart && this._actions?.onRemoveFromCart && this._productId) {
            this._actions.onRemoveFromCart(this._productId);
        } else if (!this._isInCart && this._actions?.onAddToCart) {
            this._actions.onAddToCart();
        }
    }


    render(): HTMLElement {
        return this.container;
    }
}


let previewInstance: ProductPreview | null = null;


export function getProductPreview(events: IEvents): ProductPreview {
    if (!previewInstance) {
        const template = cloneTemplate<HTMLElement>('#card-preview');
        
  
        const actions: IProductPreviewActions = {
            onAddToCart: () => {
                events.emit('cart:add');
            },
            onRemoveFromCart: (productId: string) => {
                events.emit('cart:remove', { id: productId });
            }
        };
        
        previewInstance = new ProductPreview(template, actions);
    }
    return previewInstance;
}


export function updateProductPreview(data: IProduct, isInCart: boolean, events: IEvents): ProductPreview {
    const preview = getProductPreview(events);
    preview.updateProductData(data, isInCart);
    return preview;
}