import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { AppEvents } from '../../utils/constants';

export class Cart {
    private _items: IProduct[] = [];
    private _events: IEvents;

    constructor(events: IEvents) {
        this._events = events;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this._items.push(product);
            this._events.emit(AppEvents.CART_UPDATED);
        }
    }


    removeItem(productId: string): void {
        const index = this._items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this._items.splice(index, 1);
            this._events.emit(AppEvents.CART_UPDATED);
        }
    }

    hasItem(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }

    getItems(): IProduct[] {
        return [...this._items];
    }

    getItemCount(): number {
        return this._items.length;
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }


    clear(): void {
        this._items = [];
        this._events.emit(AppEvents.CART_UPDATED);
    }
}

