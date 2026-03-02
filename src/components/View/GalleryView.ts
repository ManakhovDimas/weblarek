import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class GalleryView extends Component<HTMLElement> {

    constructor(container: HTMLElement, _events: IEvents) {
        super(container);
    }


    setItems(items: HTMLElement[]): void {
        this.container.innerHTML = '';
        items.forEach(item => {
            this.container.appendChild(item);
        });
    }


    clear(): void {
        this.container.innerHTML = '';
    }

    render(): HTMLElement {
        return this.container;
    }
}


export function createGalleryView(events: IEvents): GalleryView {
    const galleryElement = ensureElement<HTMLElement>('.gallery');
    return new GalleryView(galleryElement, events);
}
