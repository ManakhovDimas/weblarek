import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class Catalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
    private _events: IEvents;

    constructor(events: IEvents) {
        this._events = events;
    }

    saveProducts(products: IProduct[]): void {
        this._products = products;
        this._events.emit('catalog:loaded');
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this._events.emit('product:selected', product);
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }
}