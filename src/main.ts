import './scss/styles.scss';  
import { EventEmitter } from './components/base/Events'; 
import { Modal } from './components/View/Modal'; 
import { Catalog } from './components/Models/Catalog'; 
import { Cart } from './components/Models/Cart'; 
import { Buyer } from './components/Models/Buyer'; 
import { DataApiClient } from './components/Api/DataApiClient'; 
import { Api } from './components/base/Api'; 
import { API_URL } from './utils/constants'; 
import { ensureElement } from './utils/utils';

// View компоненты 
import { createHeader } from './components/View/Header'; 
import { createBasketView } from './components/View/BasketView'; 
import { getProductPreview } from './components/View/ProductPreview'; 
import { createOrderForm } from './components/View/OrderForm'; 
import { createContactsForm } from './components/View/ContactsForm'; 
import { createGalleryView } from './components/View/GalleryView';

import { App } from './components/Presenter/App';

function bootstrap(): void {     
   
    const events = new EventEmitter();

  
    const api = new Api(API_URL);     
    const apiClient = new DataApiClient(api);

    
    const catalog = new Catalog(events);     
    const cart = new Cart(events);     
    const buyer = new Buyer(events, {});

    
    const modalContainer = ensureElement('#modal-container');     
    const modal = new Modal(modalContainer);

    const header = createHeader(events);     
    const galleryView = createGalleryView(events);     
    const basketView = createBasketView(events);     
    const orderForm = createOrderForm(events);     
    const contactsForm = createContactsForm(events);     
    const productPreview = getProductPreview(events); 

     
    const app = new App({
        events,
        apiClient,
        catalog,
        cart,
        buyer,
        modal,
        header,
        galleryView,
        basketView,
        orderForm,
        contactsForm,
        productPreview
    });

    app.init(); 
}

document.addEventListener('DOMContentLoaded', bootstrap);