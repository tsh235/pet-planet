import { submitOrder } from './api';
import { createOrderMessage, renderCartList } from './dom';
import { getDataFromLS, removeFromLS, setDataToLS } from './storage';

import elems from './elems';
const {
  cartCount,
  cartList,
  cartBtn,
  modalОverlay,
  cartForm,
  cartTotalPrice
} = elems;

export const calculateTotalPrice = (cartItems, cartProducts) =>
  cartItems.reduce((acc, item) => {
    const product = cartProducts.find(prod => prod.id === item.id);
    return acc + product.price * item.count;
  }, 0);

const updateCartCount = () => {
  const cartItems = getDataFromLS('petPlanet');
  cartCount.textContent = cartItems.length;
};

export const addToCart = (productId) => {
  const cartItems = getDataFromLS('petPlanet');

  const existingItem = cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.count +=1;
  } else {
    cartItems.push({id: productId, count: 1});
  }

  setDataToLS('petPlanet', cartItems);
  updateCartCount();
};

const updateCartItem = (cartRow, productId, change) => {
  const cartItems = getDataFromLS('petPlanet');
  const cartProducts = getDataFromLS('cartProducts');
  const itemIndex = cartItems.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
    cartItems[itemIndex].count += change;
    cartRow.querySelector('.modal__cart-count')
      .textContent = cartItems[itemIndex].count;
    cartRow.querySelector('.modal__cart-price')
      .innerHTML = `${cartProducts[itemIndex].price * cartItems[itemIndex].count}&nbsp;₽`;

    if (cartItems[itemIndex].count <= 0) {
      cartItems.splice(itemIndex, 1);
      cartRow.remove();
    }

    setDataToLS('petPlanet', cartItems);

    const totalPrice = calculateTotalPrice(cartItems, cartProducts);
    cartTotalPrice.innerHTML = `${totalPrice}&nbsp;₽`;
    updateCartCount();
  }
};

cartBtn.addEventListener('click', () => {
  modalОverlay.style.display = 'flex';
  renderCartList();
});

modalОverlay.addEventListener('click', ({target}) => {
  if (target === modalОverlay || target.closest('.modal__close-btn')) {
    modalОverlay.style.display = 'none';
  }
});

cartList.addEventListener('click', ({target}) => {
  const cartRow = target.closest('.modal__cart-item');
  if (target.classList.contains('modal__count-minus')) {
    const productId = target.dataset.id;
    updateCartItem(cartRow, productId, -1);
  }

  if (target.classList.contains('modal__count-plus')) {
    const productId = target.dataset.id;
    updateCartItem(cartRow, productId, 1);
  }
});

cartForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const storeId = cartForm.pickup.value;
  const cartItems = getDataFromLS('petPlanet');
  const products = cartItems.map(({id, count}) => ({id, quantity: count}));

  const {orderId} = await submitOrder(storeId, products);

  removeFromLS('petPlanet');
  removeFromLS('cartProducts');

  updateCartCount();

  modalОverlay.style.display = 'none';
  document.body.append(createOrderMessage(orderId));

});

updateCartCount();