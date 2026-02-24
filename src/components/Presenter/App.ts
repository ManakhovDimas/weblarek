import { EventEmitter } from '../base/Events';
import { Modal } from '../View/Modal';
import { Catalog } from '../Models/Catalog';
import { Cart } from '../Models/Cart';
import { Buyer } from '../Models/Buyer';
import { DataApiClient } from '../Api/DataApiClient';
import { Api } from '../base/Api';
import { IProduct, IBuyer, IOrderRequest, TPayment, IOrderResponse } from '../../types';
import { API_URL, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

import { createCatalogItem } from '../View/CatalogItem';
import { createProductPreview } from '../View/ProductPreview'; 
import { BasketView, createBasketView } from '../View/BasketView';
import { createOrderForm } from '../View/OrderForm';
import { createContactsForm } from '../View/ContactsForm';
import { createSuccessView } from '../View/SuccessView';


export enum AppEvents {
    CATALOG_LOADED = 'catalog:loaded',
    PRODUCT_SELECTED = 'product:selected',
    PRODUCT_ADDED_TO_CART = 'product:added',
    PRODUCT_REMOVED_FROM_CART = 'product:removed',
    CART_UPDATED = 'cart:updated',
    ORDER_STARTED = 'order:started',
    ORDER_SUBMITTED = 'order:submitted',
    ORDER_COMPLETED = 'order:completed',
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close'
}

export class App extends EventEmitter {
    private _modal: Modal;
    private _catalog: Catalog;
    private _cart: Cart;
    private _buyer: Buyer;
    private _apiClient: DataApiClient;
    
   
    private _gallery: HTMLElement;
    private _basketButton: HTMLButtonElement;
    private _basketCounter: HTMLElement;
    

    constructor() {
        super();
        
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket');
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        
        const modalContainer = ensureElement<HTMLElement>('#modal-container');
        this._modal = new Modal(modalContainer);
        
       
        this._catalog = new Catalog();
        this._cart = new Cart();
        this._buyer = new Buyer({}, );
        
       
        const api = new Api(API_URL);
        this._apiClient = new DataApiClient(api);
        
       
        this._modal.on('modal:open', () => this.emit(AppEvents.MODAL_OPEN)); 
        this._modal.on('modal:close', () => this.emit(AppEvents.MODAL_CLOSE));
        
       
        this.setupEventListeners();
        
        
        this.loadCatalog();
    }

    private setupEventListeners(): void {
        
        this._basketButton.addEventListener('click', () => {
            this.openBasket();
        });
        
       
        this.on(AppEvents.CATALOG_LOADED, () => this.renderCatalog());
        this.on(AppEvents.PRODUCT_SELECTED, (product: any) => this.openProductPreview(product as IProduct));
        this.on(AppEvents.PRODUCT_ADDED_TO_CART, (product: any) => this.addToCart(product as IProduct));
        this.on(AppEvents.PRODUCT_REMOVED_FROM_CART, (product: any) => this.removeFromCart(product as IProduct));
        this.on(AppEvents.CART_UPDATED, () => this.updateBasketCounter());
        this.on(AppEvents.ORDER_STARTED, () => this.openOrderForm());
        this.on(AppEvents.ORDER_SUBMITTED, () => this.submitOrder());
      this.on(AppEvents.ORDER_COMPLETED, (data: any) => {
  
    let total: number;
    
    if (typeof data === 'number') {
        total = data;
    } else if (data && typeof data.total === 'number') {
        total = data.total;
    } else {
        console.error('Некорректные данные для ORDER_COMPLETED:', data);
        return;
    }
    
    this.showSuccess(total);
});

    }

    private async loadCatalog(): Promise<void> {
        try {
            const products = await this._apiClient.getCatalog();
            
            const productsWithFullImage = products.map(product => ({
                ...product,
                image: CDN_URL + product.image
            }));
            
            this._catalog.saveProducts(productsWithFullImage);
            this.emit(AppEvents.CATALOG_LOADED);
        } catch (error) {
            console.error('Ошибка загрузки каталога:', error);
           
        }
    }

    private renderCatalog(): void {
        const products = this._catalog.getProducts();
        this._gallery.innerHTML = '';
        
        products.forEach(product => {
            const catalogItem = createCatalogItem(product, {
                onClick: () => {
                    this.emit(AppEvents.PRODUCT_SELECTED, product);
                }
            });
            
            this._gallery.appendChild(catalogItem.render());
        });
    }

    private openProductPreview(product: IProduct): void {
        const isInCart = this._cart.hasItem(product.id);
        
        const preview = createProductPreview(product, isInCart, {
            onAddToCart: () => {
                this.emit(AppEvents.PRODUCT_ADDED_TO_CART, product);
                this._modal.close();
            },
            onRemoveFromCart: () => {
                this.emit(AppEvents.PRODUCT_REMOVED_FROM_CART, product);
                this._modal.close();
            }
        });
        
        this._modal.setContent(preview.render());
        this._modal.open();
    }

    private addToCart(product: IProduct): void {
        this._cart.addItem(product);
        this.emit(AppEvents.CART_UPDATED);
    }

    private removeFromCart(product: IProduct): void {
        this._cart.removeItem(product.id);
        this.emit(AppEvents.CART_UPDATED);
    }

    private updateBasketCounter(): void {
        const count = this._cart.getItemCount();
        this._basketCounter.textContent = count.toString();
    }

    private openBasket(): void {
    const basketView = createBasketView({
        onOrder: () => {
            if (this._cart.getItemCount() > 0) {
                this.emit(AppEvents.ORDER_STARTED);
            }
        },
        onDeleteItem: (item: IProduct) => {
            
            this._cart.removeItem(item.id);
            
            this.emit(AppEvents.CART_UPDATED);
            
            this.updateBasketDisplay(basketView);
        }
    });
    
   
    this.updateBasketDisplay(basketView);
    
    this._modal.setContent(basketView.render());
    this._modal.open();
}


private updateBasketDisplay(basketView: BasketView): void {
    const items = this._cart.getItems();
    const totalPrice = this._cart.getTotalPrice();
    
    basketView.setItems(items);
    basketView.setTotalPrice(totalPrice);
    basketView.setOrderButtonEnabled(items.length > 0);
}

    private openOrderForm(): void {
        const orderForm = createOrderForm({
            onPaymentChange: (payment: TPayment) => {
                this._buyer.setData({ payment });
                this.validateOrderStep1();
            },
            onAddressChange: (address: string) => {
                this._buyer.setData({ address });
                this.validateOrderStep1();
            },
            onSubmit: () => {
                if (this.validateOrderStep1()) {
                    this.openContactsForm();
                }
            }
        });
        
    
        const buyerData = this._buyer.getData();
        if (buyerData.payment) {
            orderForm.setPaymentMethod(buyerData.payment);
        }
        if (buyerData.address) {
            orderForm.setAddress(buyerData.address);
        }
        
        this._modal.setContent(orderForm.render());
        this._modal.open();
    }

    private validateOrderStep1(): boolean {
        const errors = this._buyer.validateData();
        const step1Errors: Partial<Record<keyof IBuyer, string>> = {};
        
        if (errors.payment) step1Errors.payment = errors.payment;
        if (errors.address) step1Errors.address = errors.address;
        
        return Object.keys(step1Errors).length === 0;
    }

    private openContactsForm(): void {
        const contactsForm = createContactsForm({
            onEmailChange: (email: string) => {
                this._buyer.setData({ email });
                this.validateOrderStep2();
            },
            onPhoneChange: (phone: string) => {
                this._buyer.setData({ phone });
                this.validateOrderStep2();
            },
            onSubmit: () => {
                if (this.validateOrderStep2()) {
                    this.emit(AppEvents.ORDER_SUBMITTED);
                }
            }
        });
        
      
        const buyerData = this._buyer.getData();
        if (buyerData.email) {
            contactsForm.setEmail(buyerData.email);
        }
        if (buyerData.phone) {
            contactsForm.setPhone(buyerData.phone);
        }
        
        this._modal.setContent(contactsForm.render());
    }

    private validateOrderStep2(): boolean {
        const errors = this._buyer.validateData();
        const step2Errors: Partial<Record<keyof IBuyer, string>> = {};
        
        
        if (errors.email) step2Errors.email = errors.email;
        if (errors.phone) step2Errors.phone = errors.phone;
        
      
        return Object.keys(step2Errors).length === 0;
    }

 private async submitOrder(): Promise<void> {
    try {
        const buyerData = this._buyer.getData();
        const cartItems = this._cart.getItems();
        const total = this._cart.getTotalPrice();
        
        const orderData: IOrderRequest = {
            ...buyerData,
            total,
            items: cartItems.map(item => item.id)
        };
        
        const response: IOrderResponse = await this._apiClient.createOrder(orderData);
        
       
        this._cart.clear();
        this._buyer.clearData();
        this.emit(AppEvents.CART_UPDATED);
        
       
        this.emit(AppEvents.ORDER_COMPLETED, { total: response.total });
        
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
       
    }
}


   private showSuccess(total: number): void {
    const successView = createSuccessView({
        onClose: () => {
            this._modal.close();
        }
    });
    
    successView.setTotal(total);
    
    this._modal.setContent(successView.render());
    this._modal.open();
}

}


export function initApp(): App {
    return new App();
}