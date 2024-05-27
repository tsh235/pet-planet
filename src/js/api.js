import { renderProducts } from './dom';

export const API_URL = 'https://heathered-amused-tanker.glitch.me';

export const fetchProducts = async category => {
  try {
    const url = category ? `category/${category}` : '';
    const response = await fetch(`${API_URL}/api/products/${url}`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error(`Ошибка запроса товаров: ${error}`);
    return [];
  }
};

export const fetchCartProducts = async (ids) => {
  try {
    const response = await fetch(`${API_URL}/api/products/list/${ids.join(',')}`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(`Ошибка запроса товаров для карзины: ${error}`);
    return [];
  }
};

export const submitOrder = async (storeId, products) => {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({storeId, products}),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    return await response.json();
  } catch (error) {
    console.log(`Ошибка оформления заказа: ${error}`);
  }
};