# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### Данные

В приложении используются две основные сущности данных, которые описываются следующими интерфейсами:

 Интерфейсы данных

 Товар (Product)

interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

Назначение: Описывает структуру данных товара в приложении. Содержит все необходимые поля для отображения и работы с товаром в каталоге и корзине.

• id: уникальный идентификатор товара (строка).
• description: описание товара (строка).
• image: URL-адрес изображения товара (строка).
• title: название товара (строка).
• category: категория, к которой относится товар (строка).
• price: цена товара (число или null, если товар без цены).

 Покупатель (Buyer)

type TPayment = 'online' | 'offline' | '' ;

interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

Назначение: Описывает структуру данных покупателя, которые необходимы для оформления заказа. Содержит контактную информацию и предпочтения по оплате.

• payment: тип оплаты, выбранный покупателем (тип TPayment).
• email: адрес электронной почты покупателя (строка).
• phone: номер телефона покупателя (строка).
• address: адрес доставки (строка).

Интерфейс запроса на создание заказа

interface IOrderRequest {
  payment: string;   
  email: string;     
  phone: string;     
  address: string;   
  total: number;     
  items: string[];   
}

Назначение: Представляет структуру данных, которую клиент отправляет на сервер для создания нового заказа. Это основной DTO (Data Transfer Object) для оформления покупки.

• payment: Определяет выбранный пользователем способ оплаты (строка).
• email: Электронная почта для связи с покупателем (строка).
• phone: Телефон для связи с покупателем (строка).
• address: Адрес доставки товаров(строка).
• total: Общая стоимость заказа (число).
• items: Список идентификаторов товаров в заказе (строка).

Интерфейс ответа сервера

interface IOrderResponse {
  id: string;     // ID созданного заказа
  total: number;  // Подтвержденная сумма заказа
}

Назначение: Представляет структуру данных, которую сервер возвращает клиенту после успешного создания заказа.

• id : Уникальный идентификатор созданного заказа (строка).
• total : Подтвержденная сервером сумма заказа (число).



Модели данных

###### Класс Catalog (Каталог товаров)

Назначение: Отвечает за хранение и управление списком всех доступных товаров в приложении, а также за хранение товара, выбранного для подробного просмотра.

Поля класса:

1 products: IProduct[] - массив товаров
   – Тип: IProduct[] (массив объектов типа IProduct)
   – Инициализация: пустой массив []
   – Назначение: хранит все товары каталога

2 selectedProduct: IProduct | null - выбранный товар
   – Тип: IProduct | null (объект типа IProduct или null)
   – Инициализация: null
   – Назначение: хранит текущий выбранный товар (например, при просмотре деталей товара)


Методы класса:
• saveProducts(products: IProduct[]): void - сохраняет массив товаров, полученный в параметрах метода
• getProducts(): IProduct[] - возвращает массив всех товаров из модели
• getProductById(id: string): IProduct | undefined - возвращает товар по его id
• setSelectedProduct(product: IProduct): void - сохраняет товар для подробного отображения
• getSelectedProduct(): IProduct | null - возвращает товар для подробного отображения

###### Класс Cart (Корзина)

Назначение: Отвечает за хранение и управление товарами, которые пользователь выбрал для покупки. Реализует логику работы с корзиной.

Поля класса:
items: IProduct[] = []
-items (тип: IProduct[]) - массив товаров для инициализации корзины (по умолчанию пустой массив)

Методы класса:
• getItems(): IProduct[] - возвращает массив товаров, которые находятся в корзине
• addItem(item: IProduct): void - добавляет товар, полученный в параметре, в массив корзины
• removeItem(productId: string): void - удаляет товар, полученный в параметре, из массива корзины
• clear(): void - очищает корзину (удаляет все товары)
• getTotalPrice(): number - возвращает общую стоимость всех товаров в корзине
• getItemCount: number - возвращает количество товаров в корзине
• hasItem(productId: string): boolean - проверяет наличие товара в корзине по его id, полученному в параметре метода

###### Класс Buyer (Покупатель)

Назначение: Отвечает за хранение и управление данными покупателя, которые необходимы для оформления заказа.

Конструктор:
constructor(data: Partial<IBuyer> = {})

• data (тип: Partial<IBuyer>) - частичные данные покупателя для инициализации (по умолчанию пустой объект)

Поля класса:
• payment (тип: TPayment) - хранит вид оплаты, выбранный покупателем
• email (тип: string) - хранит email покупателя
• phone (тип: string) - хранит телефон покупателя
• address (тип: string) - хранит адрес доставки покупателя

Методы класса:
- `setData(data: Partial<IBuyer>)` - установка данных покупателя
- `getData(): Partial<IBuyer>` - получение данных покупателя
- `validateStep1(): boolean` - валидация первого шага (оплата и адрес)
- `validateStep2(): boolean` - валидация второго шага (email и телефон)
- `validateData(): ValidationErrors<IBuyer>` - полная валидация всех полей
- `clearData(): void` - очистка данных покупателя

###### Слой коммуникации

▎Описание класса DataApiClient

Назначение: Будет служить слоем коммуникации между приложением и сервером «Веб-ларёк». Он будет использовать методы get и post из интерфейса IApi для получения и отправки данных.

Конструктор клиента API

constructor(api: IApi) - Реализация интерфейса IApi для выполнения HTTP-запросов

▎Методы класса:
- getCatalog(): Promise<IProduct[]> - получает массив товаров с эндпоинта /product/ и возвращает 
объект с полями total:number и items: IProduct[].
- createOrder(orderData: IOrderRequest): Promise<IOrderResponse> отправляет заказ на эндпоинт /order/.Сервер создает заказ и возвращает его с полями Id:string и подтвержденную сумму total: number



##### Слой представления (View)


###### 1. BasketItem (Элемент корзины)


Компонент для отображения отдельного товара в корзине.

 Основные методы:
- `setProductId(id: string)` - установка ID товара
- `setIndex(index: number)` - установка порядкового номера
- `setTitle(title: string)` - установка названия товара
- `setPrice(price: number)` - установка цены

 Фабричная функция:

createBasketItem(item: IProduct, index: number, events: IEvents): BasketItem


###### 2. BasketView (Вид корзины)


Компонент для отображения всей корзины покупок.

 Основные методы:
- `setItems(items: HTMLElement[])` - установка списка товаров
- `setTotalPrice(price: number)` - установка общей стоимости
- `setOrderButtonEnabled(enabled: boolean)` - активация кнопки заказа
- `renderEmpty(): void` - отображение пустой корзины

 Фабричная функция:

createBasketView(events: IEvents): BasketView


###### 3. Card (Базовый класс карточки)


Абстрактный базовый класс для всех карточек товаров.

 Основные методы:
- `setTitle(title: string)` - установка заголовка
- `setPrice(price: number | null)` - установка цены

###### 4. CatalogItem (Карточка товара в каталоге)


Компонент для отображения товара в каталоге.

 Основные методы:
- `setCardImage(src: string, alt?: string)` - установка изображения
- `setCategory(category: string)` - установка категории
- `setDescription(description: string)` - установка описания

 Фабричная функция:

createCatalogItem(product: IProduct, events: IEvents): CatalogItem


###### 5. ContactsForm (Форма контактов)


Форма для ввода контактных данных покупателя.

 Основные методы:
- `setEmail(email: string)` - установка email
- `setPhone(phone: string)` - установка телефона
- `setValidationErrors(errors: ValidationErrors<IBuyer>)` - установка ошибок валидации
- `setValid(isValid: boolean)` - установка валидности формы

 Фабричная функция:

createContactsForm(events: IEvents): ContactsForm


###### 6. Form (Базовый класс формы)


Абстрактный базовый класс для всех форм.

 Основные методы:
- `setErrors(errors: Record<string, string>)` - установка ошибок
- `setSubmitButtonEnabled(enabled: boolean)` - активация кнопки отправки
- `setupSubmitHandler(callback?: () => void)` - настройка обработчика отправки

###### 7. GalleryView (Вид галереи)


Компонент для отображения галереи товаров.

 Основные методы:
- `setItems(items: HTMLElement[])` - установка списка товаров
- `clear(): void` - очистка галереи

 Фабричная функция:

createGalleryView(events: IEvents): GalleryView


###### 8. Header (Шапка)


Компонент шапки сайта с корзиной.

Основные методы:
- `setCounter(count: number)` - установка счетчика товаров в корзине

 Фабричная функция:

createHeader(events: IEvents): Header


###### 9. Modal (Модальное окно)


Компонент модального окна.

 Основные методы:
- `open(): void` - открытие модального окна
- `close(): void` - закрытие модального окна
- `setContent(content: HTMLElement)` - установка содержимого
- `on(event: string, callback: Function)` - подписка на события
- `emit(event: string, ...args: any[])` - генерация событий

###### 10. OrderForm (Форма заказа)


Форма для ввода данных доставки и оплаты.

 Основные методы:
- `setPaymentMethod(method: TPayment)` - установка способа оплаты
- `setAddress(address: string)` - установка адреса
- `setValidationErrors(errors: ValidationErrors<IBuyer>)` - установка ошибок валидации
- `setValid(isValid: boolean)` - установка валидности формы

Фабричная функция:

createOrderForm(events: IEvents): OrderForm


###### 11. ProductPreview (Превью товара)


Компонент для детального просмотра товара.

 Основные методы:
- `setInCart(value: boolean)` - установка статуса в корзине
- `setDescription(description: string)` - установка описания
- `setCardImage(src: string, alt?: string)` - установка изображения
- `setButtonText(text: string)` - установка текста кнопки
- `updateProductData(data: IProduct, isInCart: boolean)` - обновление данных товара

Утилиты:

getProductPreview(events: IEvents): ProductPreview
updateProductPreview(data: IProduct, isInCart: boolean, events: IEvents): ProductPreview


###### 12. SuccessView (Вид успешного заказа)


Компонент для отображения успешного оформления заказа.

 Основные методы:
- `setTotal(total: number)` - установка суммы заказа

 Фабричная функция:

createSuccessView(events: IEvents): SuccessView


###### Презентер (Presenter)

###### App (Главный презентер)


Основной класс приложения, управляющий всеми компонентами.

 Основные методы:
- `init(): void` - инициализация приложения
- `setupEventListeners(): void` - настройка обработчиков событий
- `loadCatalog(): Promise<void>` - загрузка каталога товаров
- `renderCatalog(): void` - отображение каталога
- `updateProductPreview(product: IProduct): void` - обновление превью товара
- `updateBasketView(items: IProduct[], total: number): void` - обновление вида корзины
- `submitOrder(): Promise<void>` - отправка заказа
- `showSuccess(total: number): void` - отображение успешного заказа

 События приложения (AppEvents):

enum AppEvents {
    // События моделей
    CATALOG_LOADED = 'catalog:loaded',
    PRODUCT_SELECTED = 'product:selected',
    CART_UPDATED = 'cart:updated',
    BUYER_UPDATED = 'buyer:updated',
    FORM_UPDATE = 'form:update',
    
    // События UI
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close',
    BASKET_OPEN = 'basket:open',
    ORDER_OPEN = 'order:open',
    CONTACTS_OPEN = 'contacts:open',
    
    // События форм
    PAYMENT_CHANGE = 'payment:change',
    ADDRESS_CHANGE = 'address:change',
    EMAIL_CHANGE = 'email:change',
    PHONE_CHANGE = 'phone:change',
    ORDER_SUBMIT = 'order:submit',
    CONTACTS_SUBMIT = 'contacts:submit',
    
    // События карточек
    CARD_CLICK = 'card:click',
    ADD_TO_CART = 'cart:add',
    REMOVE_FROM_CART = 'cart:remove'
}



###### main.ts


Точка входа приложения, инициализирующая все компоненты.

 Основные функции:
- `bootstrap(): void` - функция инициализации приложения
- Создание всех зависимостей и их инъекция в App
- Запуск приложения после загрузки DOM

