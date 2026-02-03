
import { IApi, IProduct , IOrderRequest, IOrderResponse} from '../../types';

export class DataApiClient {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение каталога: сервер возвращает { total, items }
  getCatalog(): Promise<IProduct[]> {
    return this.api
      .get<{ total: number; items: IProduct[] }>('/product/')
      .then((res) => res.items);
  }

  // Отправка заказа на сервер
  createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', orderData);
  }
}


