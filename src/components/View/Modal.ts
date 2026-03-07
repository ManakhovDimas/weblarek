import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IModal {
    open(): void;
    close(): void;
    setContent(content: HTMLElement): void;
}

export class Modal extends Component<IModal> implements IModal {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = 'auto';
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