const storeList = document.querySelector('.store__list');
const categoryBtns = document.querySelectorAll('.store__categories-btn');
const storeTitle = document.querySelector('.store__title');
const cartBtn = document.querySelector('.store__cart-btn');
const cartCount = cartBtn.querySelector('.store__cart-count');
const modalОverlay = document.querySelector('.modal-overlay');
const cartList = modalОverlay.querySelector('.modal__cart-list');
const modalSubmit = modalОverlay.querySelector('.modal__cart-submit');
const cartTotalPrice = document.querySelector('.modal__cart-total-price');
const cartForm = document.querySelector('.modal__pickup');

export default {
  storeList,
  categoryBtns,
  storeTitle,
  cartBtn,
  cartCount,
  modalОverlay,
  cartList,
  modalSubmit,
  cartTotalPrice,
  cartForm,
};