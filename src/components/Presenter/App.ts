import { IEvents } from '../base/Events';
import { Modal } from '../View/Modal';
import { Catalog } from '../Models/Catalog';
import { Cart } from '../Models/Cart';
import { Buyer } from '../Models/Buyer';
import { DataApiClient } from '../Api/DataApiClient';
import { IProduct, IOrderRequest, IOrderResponse, TPayment } from '../../types';
import { CDN_URL, AppEvents } from '../../utils/constants';

// View компоненты
import { Header } from '../View/Header';
import { GalleryView } from '../View/GalleryView';
import { BasketView } from '../View/BasketView';
import { OrderForm } from '../View/OrderForm';
import { ContactsForm } from '../View/ContactsForm';
import { ProductPreview } from '../View/ProductPreview';
import { createBasketItem } from '../View/BasketItem';
import { SuccessView } from '../View/SuccessView';
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
    successView: SuccessView;
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
    private _successView: SuccessView;

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
        this._successView = deps.successView;
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
            const isInCart = this._cart.hasItem(product.id);
            this._productPreview.updateProductData(product, isInCart);
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
            const errors = this._buyer.validateData();
            
            // Обновление полей формы заказа
            this._orderForm.setAddress(buyerData.address);
            this._orderForm.setPaymentMethod(buyerData.payment);
            
            // Обновление полей формы контактов
            this._contactsForm.setEmail(buyerData.email);
            this._contactsForm.setPhone(buyerData.phone);
            
            // Обновление ошибок валидации
            this._orderForm.setValidationErrors({
                payment: errors.payment,
                address: errors.address
            });
            
            this._contactsForm.setValidationErrors({
                email: errors.email,
                phone: errors.phone
            });
            
            // Блокировка кнопок отправки при наличии ошибок
            const hasOrderErrors = !!(errors.payment || errors.address);
            const hasContactsErrors = !!(errors.email || errors.phone);
            
            this._orderForm.setSubmitButtonEnabled(!hasOrderErrors);
            this._contactsForm.setSubmitButtonEnabled(!hasContactsErrors);
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
            // Только меняем контент модального окна
            this._modal.setContent(this._contactsForm.render());
        });

        this._events.on(AppEvents.CONTACTS_SUBMIT, () => {
            // Только отправляем заказ
            this.submitOrder();
        });

        this._events.on(AppEvents.MODAL_CLOSE, () => {
            this._modal.close();
        });

        // Новый обработчик для превью
        this._events.on(AppEvents.PREVIEW_TOGGLE, () => {
            const selectedProduct = this._catalog.getSelectedProduct();
            if (selectedProduct) {
                if (this._cart.hasItem(selectedProduct.id)) {
                    // Удаляем продукт из корзины
                    this._cart.removeItem(selectedProduct.id);
                } else {
                    // Добавляем продукт в корзину
                    this._cart.addItem(selectedProduct);
                }
                // Закрываем модальное окно
                this._modal.close();
            }
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
            const catalogItem = createCatalogItem(
                product,
                () => {
                    // Модель сама генерирует событие после обновления
                    this._catalog.setSelectedProduct(product);
                }
            );
            catalogItems.push(catalogItem.render());
        });
        
        this._galleryView.setItems(catalogItems);
    }

    private updateBasketView(items: IProduct[], total: number): void {
        const basketItems = items.map((item, index) => {
            const basketItem = createBasketItem(
                item,
                index + 1,
                () => {
                    this._events.emit(AppEvents.REMOVE_FROM_CART, {
                        id: item.id,
                        fromBasket: true
                    });
                }
            );
            return basketItem.render();
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
        this._successView.setTotal(total);
        this._modal.setContent(this._successView.render());
    }
}