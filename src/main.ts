import './scss/styles.scss';
// src/main.ts
import { Catalog } from './components/base/Models/Catalog';
import { Cart } from './components/base/Models/Cart';
import { Buyer } from './components/base/Models/Buyer';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { DataApiClient } from './components/base/DataApiClient';
import { IProduct } from './types';

const buyer = new Buyer();

console.log('--- Тестирование Buyer ---');

buyer.setData({
  email: 'buyertest@example.com',
  phone: '+79000043000',
  address: 'Калининград, ул. Калужская, д. 8',
  payment: 'online'
});

console.log('Данные покупателя после установки:', buyer.getData());

const validationErrors = buyer.validateData();
console.log('Ошибки валидации (должно быть пусто):', validationErrors);

buyer.clearData();
console.log('Данные покупателя после очистки:', buyer.getData());

// Создаем и тестируем модель Cart
const cart = new Cart();

console.log('--- Тестирование Cart ---');

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);

console.log('Массив товаров в корзине после добавления:');

console.log(cart.getItems());

console.log('Общая цена:', cart.getTotalPrice());

console.log('Количество товара:', cart.getItemCount());

console.log('Проверка наличия товара с id "854cef69-976d-4c2a-a18c-2aa45046c390":', cart.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

cart.removeItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Массив товаров после удаления одного:');
console.log(cart.getItems());

cart.clear();
console.log('Массив товаров после очистки:');
console.log(cart.getItems());

// Создаем и тестируем модель Catalog
const catalog = new Catalog();

console.log('--- Тестирование Catalog ---');

catalog.saveProducts(apiProducts.items);
console.log('Все товары через getProducts():');
console.log(catalog.getProducts());

const productById = catalog.getProductById('b06cde61-912f-4663-9751-09956c0eed67');
console.log('Поиск товара по ID:', productById);

if (productById) {
  catalog.setSelectedProduct(productById);
  console.log('Выбранный товар:', catalog.getSelectedProduct());
} else {
  console.log('Товар не найден');
}

//Получение каталога с сервера
console.log('--- Получение каталога с сервера ---');


const catalogModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

const api = new Api(API_URL);
const remoteApi = new DataApiClient(api);

remoteApi.getCatalog()
  .then((remoteItems: IProduct[]) => {
    catalogModel.saveProducts(remoteItems);
    console.log('Каталог получен с сервера и сохранён в модель:', catalogModel.getProducts());
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога с сервера:', err);
  });

const products = catalogModel.getProducts();
if (products.length > 0) {
  cartModel.addItem(products[0]);
  if (products.length > 1) cartModel.addItem(products[1]);
}

console.log('Товары в корзине:', cartModel.getItems());
console.log('Итоговая стоимость:', cartModel.getTotalPrice());


buyerModel.setData({
  payment: 'online',
  email: 'buyer@example.com',
  phone: '+79000043000',
  address: 'Калининград, ул. Калужская, д. 8'
});

console.log('Данные покупателя для заказа:', buyerModel.getData());


