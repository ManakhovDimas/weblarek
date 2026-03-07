import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { AppEvents } from '../../utils/constants';

export class Catalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
    private _events: IEvents;

    constructor(events: IEvents) {
        this._events = events;
    }

    saveProducts(products: IProduct[]): void {
        this._products = products;
        this._events.emit(AppEvents.CATALOG_LOADED);
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this._events.emit(AppEvents.PRODUCT_SELECTED, product);
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }
}