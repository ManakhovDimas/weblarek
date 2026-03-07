// Константа для получения полного пути для сервера. Для выполнения запроса
// необходимо к API_URL добавить только ендпоинт.
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

// Константа для формирования полного пути к изображениям карточек.
// Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
// которое хранится в объекте товара.
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

// Константа соответствий категорий товара модификаторам, используемым для отображения фона категории.
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

// События приложения
export enum AppEvents {
  // События моделей
  CATALOG_LOADED = 'catalog:loaded',//
  PRODUCT_SELECTED = 'product:selected',//
  CART_UPDATED = 'cart:updated',//
  BUYER_UPDATED = 'buyer:updated',
  FORM_UPDATE = 'form:update',//
  
  // События UI
  MODAL_OPEN = 'modal:open',//
  MODAL_CLOSE = 'modal:close',//
  BASKET_OPEN = 'basket:open',//
  ORDER_OPEN = 'order:open',//
  CONTACTS_OPEN = 'contacts:open',
  
  // События форм
  PAYMENT_CHANGE = 'payment:change',//
  ADDRESS_CHANGE = 'address:change',//
  EMAIL_CHANGE = 'email:change',//
  PHONE_CHANGE = 'phone:change',//
  ORDER_SUBMIT = 'order:submit',//
  CONTACTS_SUBMIT = 'contacts:submit',//
  
  // События карточек
  CARD_CLICK = 'card:click',
  ADD_TO_CART = 'cart:add',
  REMOVE_FROM_CART = 'cart:remove',
  
  // Событие для превью
  PREVIEW_TOGGLE = 'preview:toggle'//
}