export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для ошибок валидации
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

// Тип для способа оплаты
export type TPayment = 'online' | 'offline'| '';

// Интерфейс для товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс для покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderRequest {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}
