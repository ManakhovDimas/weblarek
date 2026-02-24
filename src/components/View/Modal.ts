
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IModal {
    open(): void;
    close(): void;
    setContent(content: HTMLElement): void;
    on(event: string, callback: Function): void;
    emit(event: string, ...args: any[]): void;
}

export class Modal extends Component<IModal> implements IModal {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;
    private _listeners: Map<string, Function[]> = new Map();

    constructor(container: HTMLElement) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    on(event: string, callback: Function): void {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, []);
        }
        this._listeners.get(event)!.push(callback);
    }

    emit(event: string, ...args: any[]): void {
        if (this._listeners.has(event)) {
            this._listeners.get(event)!.forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Ошибка в обработчике события ${event}:`, error);
                }
            });
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
        this.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = 'auto';
        this.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this._content.innerHTML = '';
        this._content.appendChild(content);
    }

    private handleOutsideClick(event: MouseEvent): void {
        if (event.target === this.container) {
            this.close();
        }
    }
}
