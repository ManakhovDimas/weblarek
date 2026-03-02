// App.ts
import { IEvents } from '../base/Events';
import { Modal } from '../View/Modal';
import { Catalog } from '../Models/Catalog';
import { Cart } from '../Models/Cart';
import { Buyer } from '../Models/Buyer';
import { DataApiClient } from '../Api/DataApiClient';
import { IProduct, IOrderRequest, IOrderResponse, TPayment } from '../../types';
import { CDN_URL } from '../../utils/constants';


// View компоненты
import { Header } from '../View/Header';
import { GalleryView } from '../View/GalleryView';
import { BasketView } from '../View/BasketView';
import { OrderForm } from '../View/OrderForm';
import { ContactsForm } from '../View/ContactsForm';
import { ProductPreview } from '../View/ProductPreview';
import { createBasketItem } from '../View/BasketItem';
import { createSuccessView } from '../View/SuccessView';
import { createCatalogItem } from '../View/CatalogItem';


// Интерфейс зависимостей для внедрения
interface IAppDependencies {
    events: IEvents;
    apiClient: DataApiClient;
    // Models
    catalog: Catalog;
    cart: Cart;
    buyer: Buyer;
    // Views
    modal: Modal;
    header: Header;
    galleryView: GalleryView;
    basketView: BasketView;
    orderForm: OrderForm;
    contactsForm: ContactsForm;
    productPreview: ProductPreview;
}


// События приложения
export enum AppEvents {
    // События моделей
    CATALOG_LOADED = 'catalog:loaded',
    PRODUCT_SELECTED = 'product:selected',
    CART_UPDATED = 'cart:updated',
    BUYER_UPDATED = 'buyer:updated',
    FORM_UPDATE = 'form:update',
    
    // События UI
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close',
    BASKET_OPEN = 'basket:open',
    ORDER_OPEN = 'order:open',
    CONTACTS_OPEN = 'contacts:open',
    
    // События форм
    PAYMENT_CHANGE = 'payment:change',
    ADDRESS_CHANGE = 'address:change',
    EMAIL_CHANGE = 'email:change',
    PHONE_CHANGE = 'phone:change',
    ORDER_SUBMIT = 'order:submit',
    CONTACTS_SUBMIT = 'contacts:submit',
    
    // События карточек
    CARD_CLICK = 'card:click',
    ADD_TO_CART = 'cart:add',
    REMOVE_FROM_CART = 'cart:remove'
}


export class App {
    private _events: IEvents;
    private _apiClient: DataApiClient;
    
    // Models
    private _catalog: Catalog;
    private _cart: Cart;
    private _buyer: Buyer;
    
    // Views
    private _modal: Modal;
    private _header: Header;
    private _galleryView: GalleryView;
    private _basketView: BasketView;
    private _orderForm: OrderForm;
    private _contactsForm: ContactsForm;
    private _productPreview: ProductPreview;


    constructor(deps: IAppDependencies) {
        this._events = deps.events;
        this._apiClient = deps.apiClient;
        this._catalog = deps.catalog;
        this._cart = deps.cart;
        this._buyer = deps.buyer;
        this._modal = deps.modal;
        this._header = deps.header;
        this._galleryView = deps.galleryView;
        this._basketView = deps.basketView;
        this._orderForm = deps.orderForm;
        this._contactsForm = deps.contactsForm;
        this._productPreview = deps.productPreview;
    }


    init(): void {
        this.setupEventListeners();
        this.loadCatalog();
    }


    private setupEventListeners(): void {
        
        this._events.on(AppEvents.CATALOG_LOADED, () => {
            this.renderCatalog();
        });


        this._events.on<IProduct>(AppEvents.PRODUCT_SELECTED, (product) => {
            this.updateProductPreview(product);
            this._modal.setContent(this._productPreview.render());
            this._modal.open();
        });


        this._events.on(AppEvents.CART_UPDATED, () => {
            const count = this._cart.getItemCount();
            const items = this._cart.getItems();
            const total = this._cart.getTotalPrice();
            
            this._header.setCounter(count);
            this.updateBasketView(items, total);
        });


        this._events.on(AppEvents.FORM_UPDATE, () => {
            const buyerData = this._buyer.getData();
            
            this._orderForm.setAddress(buyerData.address || '');
            if (buyerData.payment) {
                this._orderForm.setPaymentMethod(buyerData.payment);
            }
            
            this._contactsForm.setEmail(buyerData.email || '');
            this._contactsForm.setPhone(buyerData.phone || '');
        });

        
        this._events.on(AppEvents.BASKET_OPEN, () => {
            this._modal.setContent(this._basketView.render());
            this._modal.open();
        });


        this._events.on<IProduct>(AppEvents.CARD_CLICK, (product) => {
            this._catalog.setSelectedProduct(product);
        });


       this._events.on(AppEvents.ADD_TO_CART, () => {
        const selectedProduct = this._catalog.getSelectedProduct();
        if (selectedProduct) {
            this._cart.addItem(selectedProduct);
            this._modal.close(); 
        }
    });


     this._events.on<{ id: string; fromBasket?: boolean }>(AppEvents.REMOVE_FROM_CART, ({ id, fromBasket }) => {
        this._cart.removeItem(id);

        if (!fromBasket) {
            this._modal.close();
        }
    });



        this._events.on<{ payment: TPayment }>(AppEvents.PAYMENT_CHANGE, ({ payment }) => {
            this._buyer.setData({ payment });
        });


        this._events.on<{ address: string }>(AppEvents.ADDRESS_CHANGE, ({ address }) => {
            this._buyer.setData({ address });
        });


        this._events.on<{ email: string }>(AppEvents.EMAIL_CHANGE, ({ email }) => {
            this._buyer.setData({ email });
        });


        this._events.on<{ phone: string }>(AppEvents.PHONE_CHANGE, ({ phone }) => {
            this._buyer.setData({ phone });
        });


        this._events.on(AppEvents.ORDER_OPEN, () => {
            this._modal.setContent(this._orderForm.render());
        });


        this._events.on(AppEvents.ORDER_SUBMIT, () => {
            if (this._buyer.validateStep1()) {
                this._modal.setContent(this._contactsForm.render());
            } else {
                const errors = this._buyer.validateData();
                this._orderForm.setValidationErrors(errors);
            }
        });


        this._events.on(AppEvents.CONTACTS_SUBMIT, () => {
            if (this._buyer.validateStep2()) {
                this.submitOrder();
            } else {

                const errors = this._buyer.validateData();
                this._contactsForm.setValidationErrors(errors);
            }
        });


        this._events.on(AppEvents.MODAL_CLOSE, () => {
            this._modal.close();
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
        } catch (error) {
            console.error('Ошибка загрузки каталога:', error);
        }
    }


    private renderCatalog(): void {
        const products = this._catalog.getProducts();
        const catalogItems: HTMLElement[] = [];
        
        products.forEach(product => {
            const catalogItem = createCatalogItem(product, this._events);
            catalogItems.push(catalogItem.render());
        });
        
        this._galleryView.setItems(catalogItems);
    }


    private updateProductPreview(product: IProduct): void {
        const isInCart = this._cart.hasItem(product.id);
        this._productPreview.updateProductData(product, isInCart);
    }


    private updateBasketView(items: IProduct[], total: number): void {
        const basketItems: HTMLElement[] = [];
        
        items.forEach((item, index) => {
            const basketItem = createBasketItem(item, index + 1, this._events);
            basketItems.push(basketItem.render());
        });
        
        this._basketView.setItems(basketItems);
        this._basketView.setTotalPrice(total);
        this._basketView.setOrderButtonEnabled(items.length > 0);
    }


    private async submitOrder(): Promise<void> {
        try {
            const buyerData = this._buyer.getData();
            const cartItems = this._cart.getItems();
            const total = this._cart.getTotalPrice();

            if (!buyerData.payment || !buyerData.address || !buyerData.email || !buyerData.phone) {
                console.error('Не все обязательные поля заполнены');
                return;
            }


            const orderData: IOrderRequest = {
                payment: buyerData.payment,
                email: buyerData.email,
                phone: buyerData.phone,
                address: buyerData.address,
                total,
                items: cartItems.map(item => item.id)
            };

            const response: IOrderResponse = await this._apiClient.createOrder(orderData);

            this._cart.clear();
            this._buyer.clearData();


            this.showSuccess(response.total);
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
        }
    }


    private showSuccess(total: number): void {
        const successView = createSuccessView(this._events);
        successView.setTotal(total);
        this._modal.setContent(successView.render());
    }
}