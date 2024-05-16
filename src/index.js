const API_URL = 'https://heathered-amused-tanker.glitch.me';

const storeList = document.querySelector('.store__list');
const categoryBtns = document.querySelectorAll('.store__categories-btn');
const storeTitle = document.querySelector('.store__title');
const cartBtn = document.querySelector('.store__cart-btn');
const cartCount = cartBtn.querySelector('.store__cart-count');
const modalОverlay = document.querySelector('.modal-overlay');
const cartList = modalОverlay.querySelector('.modal__cart-list');
const modalCloseBtn = modalОverlay.querySelector('.modal-overlay__close-btn');

const createProductCard = ({name, photoUrl, price}) => {
  const li = document.createElement('li');
  li.classList.add('store__item');
  li.insertAdjacentHTML('beforeend', `
    <article class="store__product product">
      <img class="product__img" src="${API_URL}${photoUrl}" alt="${name}" width="388" height="261">
      <h3 class="product__title">${name}</h3>
      <p class="product__price">${price}&nbsp;₽</p>
      <button class="product__btn-add-cart">Заказать</button>
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
  }
};

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

const renderCartList = () => {
  cartList.textContent = '';
  const products = JSON.parse(localStorage.getItem('petPlanet') || '[]');
  console.log('products.length: ', !products.length);

  if (!products.length) {
    const li = document.createElement('li');
    li.classList.add('modal__cart-item-empty');
    li.textContent = 'Вы забыли выбрать товары';
    cartList.append(li);
    return;
  }
  
  const productsList = products.map(product => {
    const li = document.createElement('li');
    li.classList.add('modal__cart-item');
    li.textContent = product;
    return li;
  });

  cartList.append(...productsList);
  return cartList;
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

const addToCart = (productName) => {
  const cartItems = JSON.parse(localStorage.getItem('petPlanet') || '[]');
  cartItems.push(productName);
  localStorage.setItem('petPlanet', JSON.stringify(cartItems));
  
  console.log('cartItems: ', cartItems);
  updateCartCount();
};

storeList.addEventListener('click', ({target}) => {
  if (target.closest('.product__btn-add-cart')) {
    const productCard = target.closest('.store__product');
    const productName = productCard.querySelector('.product__title').textContent;
    addToCart(productName);
  }
});

updateCartCount();
fetchProduct();