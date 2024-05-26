const API_URL = 'https://heathered-amused-tanker.glitch.me';

const storeList = document.querySelector('.store__list');
const categoryBtns = document.querySelectorAll('.store__categories-btn');
const storeTitle = document.querySelector('.store__title');
const cartBtn = document.querySelector('.store__cart-btn');
const cartCount = cartBtn.querySelector('.store__cart-count');
const modalОverlay = document.querySelector('.modal-overlay');
const cartList = modalОverlay.querySelector('.modal__cart-list');
const modalCloseBtn = modalОverlay.querySelector('.modal-overlay__close-btn');
const modalSubmit = modalОverlay.querySelector('.modal__cart-submit');
const cartTotalPrice = document.querySelector('.modal__cart-total-price');
const cartForm = document.querySelector('.modal__pickup');

const orderMessageElem = document.createElement('div');
orderMessageElem.classList.add('order-message');

const orderMessageText = document.createElement('p');
orderMessageText.classList.add('order-message__text');

const orderMessageBtn = document.createElement('button');
orderMessageBtn.classList.add('order-message__btn');
orderMessageBtn.textContent = 'Закрыть';

orderMessageElem.append(orderMessageText, orderMessageBtn);

orderMessageBtn.addEventListener('click', () => {
  orderMessageElem.remove();
});

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

const renderProducts = (products) => {
  storeList.textContent = '';

  const productCards = products.map(product => {
    return createProductCard(product);
  });

  storeList.append(...productCards);
};

const fetchProduct = async category => {
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

const fetchCartProducts = async (ids) => {
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
}

const changeTitle = category => {
  storeTitle.textContent = '';
  
  switch(category) {
    case 'Домики':
      storeTitle.textContent = 'Каталог домиков'
      break
    case 'Лежанки':
      storeTitle.textContent = 'Каталог лежанок'
      break
    case 'Игрушки':
      storeTitle.textContent = 'Каталог игрушек'
      break
    case 'Корма':
      storeTitle.textContent = 'Каталог кормов'
      break
  }
};

const changeCategory = ({target}) => {
  const category = target.dataset.category;

  categoryBtns.forEach(btn => {
    btn.classList.remove('store__categories-btn_active');
  });

  target.classList.add('store__categories-btn_active');
  changeTitle(category);
  fetchProduct(category);
};

categoryBtns.forEach(btn => {
  btn.addEventListener('click', changeCategory);
});

const calculateTotalPrice = (cartItems, cartProducts) =>
  cartItems.reduce((acc, item) => {
    const product = cartProducts.find(prod => prod.id === item.id);
    return acc + product.price * item.count;
  }, 0);

const renderCartItems = () => {
  const cartItems = JSON.parse(localStorage.getItem('petPlanet') || '[]');
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');

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
}

const renderCartList = async () => {
  cartList.textContent = '';
  const data = JSON.parse(localStorage.getItem('petPlanet') || '[]');
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
  localStorage.setItem('cartProducts', JSON.stringify(products));

  const productsList = renderCartItems();
  cartList.append(...productsList);
};

cartBtn.addEventListener('click', () => {
  modalОverlay.style.display = 'flex';
  renderCartList();
});

modalОverlay.addEventListener('click', ({target}) => {
  if (target === modalОverlay || target.closest('.modal-overlay__close-btn')) {
    modalОverlay.style.display = 'none';
  }
});

const updateCartCount = () => {
  const cartItems = JSON.parse(localStorage.getItem('petPlanet') || '[]');
  cartCount.textContent = cartItems.length;
}

const addToCart = (productId) => {
  const cartItems = JSON.parse(localStorage.getItem('petPlanet') || '[]');

  const existingItem = cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.count +=1;
  } else {
    cartItems.push({id: productId, count: 1});
  }

  localStorage.setItem('petPlanet', JSON.stringify(cartItems));
  updateCartCount();
};

storeList.addEventListener('click', ({target}) => {
  if (target.closest('.product__btn-add-cart')) {
    const productId = target.dataset.id;
    addToCart(productId);
  }
});

const updateCartItem = (productId, change) => {
  console.log('productId: ', productId);
  const cartItems = JSON.parse(localStorage.getItem('petPlanet') || '[]');
  const itemIndex = cartItems.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
    cartItems[itemIndex].count += change;

    if (cartItems[itemIndex].count <= 0) {
      cartItems.splice(itemIndex, 1);
    }

    localStorage.setItem('petPlanet', JSON.stringify(cartItems));

    renderCartList();
    updateCartCount();
  }
};

cartList.addEventListener('click', ({target}) => {
  if (target.classList.contains('modal__count-minus')) {
    const productId = target.dataset.id;
    updateCartItem(productId, -1);
  }

  if (target.classList.contains('modal__count-plus')) {
    const productId = target.dataset.id;
    updateCartItem(productId, 1);
  }
});

const submitOrder = async e => {
  e.preventDefault();

  const storeId = cartForm.pickup.value;
  const cartItems = JSON.parse(localStorage.getItem('petPlanet') || '[]');
  const products = cartItems.map(({id, count}) => ({id, quantity: count}));

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

    
    const {orderId} = await response.json();
    const date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    orderMessageText.textContent = `Ваш заказ оформлен. Номер заказа ${orderId}. Вы можете его забрать ${date.toLocaleDateString()} после 12:00.`
    
    localStorage.removeItem('petPlanet');
    localStorage.removeItem('cartProducts');

    updateCartCount();

    modalОverlay.style.display = 'none';
    document.body.append(orderMessageElem);
  } catch (error) {
    console.log(`Ошибка оформления заказа: ${error}`);
  }
};

cartForm.addEventListener('submit', submitOrder);

updateCartCount();
fetchProduct();