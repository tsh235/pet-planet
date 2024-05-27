import { API_URL, fetchCartProducts } from './api';
import { calculateTotalPrice } from './cart';
import { getDataFromLS, setDataToLS } from './storage';

import elems from './elems';
const {
  modalSubmit,
  cartList,
  storeList,
  cartTotalPrice,
} = elems;

export const createOrderMessage = (orderId) => {
  const date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  
  const orderMessageElem = document.createElement('div');
  orderMessageElem.classList.add('order-message');

  const orderMessageText = document.createElement('p');
  orderMessageText.classList.add('order-message__text');
  orderMessageText.textContent = `Ваш заказ оформлен. Номер заказа ${orderId}. Вы можете его забрать ${date.toLocaleDateString()} после 12:00.`
  
  const orderMessageBtn = document.createElement('button');
  orderMessageBtn.classList.add('order-message__btn');
  orderMessageBtn.textContent = 'Закрыть';

  orderMessageElem.append(orderMessageText, orderMessageBtn);

  orderMessageBtn.addEventListener('click', () => {
    orderMessageElem.remove();
  });

  return orderMessageElem;
}

const createProductCard = ({id, name, photoUrl, price}) => {
  const li = document.createElement('li');
  li.classList.add('store__item');
  li.insertAdjacentHTML('beforeend', `
    <article class="store__product product">
      <img class="product__img" src="${API_URL}${photoUrl}" alt="${name}" width="388" height="261">
      <h3 class="product__title">${name}</h3>
      <p class="product__price">${price}&nbsp;₽</p>
      <button class="product__btn-add-cart" data-id="${id}">Заказать</button>
    </article>
  `);

  return li;
};

export const renderProducts = (products) => {
  storeList.textContent = '';

  const productCards = products.map(product => {
    return createProductCard(product);
  });

  storeList.append(...productCards);
};

export const renderCartItems = () => {
  const cartItems = getDataFromLS('petPlanet');
  const cartProducts = getDataFromLS('cartProducts');

  const productsList = cartProducts.map(({id, name, price, photoUrl}) => {
    const cartItem = cartItems.find(item => item.id === id);
    if (!cartItem) return;

    const li = document.createElement('li');
    li.classList.add('modal__cart-item');

    li.insertAdjacentHTML('beforeend', `
      <img class="modal__cart-img" src="${API_URL}${photoUrl}" alt="${name}">
      <h3 class="modal__cart-title">${name}</h3>
      <div class="modal__cart-count-block">
        <button class="modal__count-btn modal__count-minus" data-id="${id}">-</button>
        <span class="modal__cart-count">${cartItem.count}</span>
        <button class="modal__count-btn modal__count-plus" data-id="${id}">+</button>
      </div>
      <p class="modal__cart-price">${price * cartItem.count}&nbsp;₽</p>
    `);
    return li;
  });

  const totalPrice = calculateTotalPrice(cartItems, cartProducts);
  cartTotalPrice.innerHTML = `${totalPrice}&nbsp;₽`;

  return productsList;
};

export const renderCartList = async () => {
  cartList.textContent = '';
  const data = getDataFromLS('petPlanet');
  const ids = data.map(item => item.id);

  if (!data.length) {
    const li = document.createElement('li');
    li.classList.add('modal__cart-item-empty');
    li.textContent = 'Товары для заказа не выбраны';
    cartList.append(li);
    modalSubmit.style.pointerEvents = 'none';
    return;
  }

  modalSubmit.style.pointerEvents = '';
  const products = await fetchCartProducts(ids);
  setDataToLS('cartProducts', products);

  const productsList = renderCartItems();
  cartList.append(...productsList);
};