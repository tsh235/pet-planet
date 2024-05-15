const API_URL = 'https://heathered-amused-tanker.glitch.me';

const storeList = document.querySelector('.store__list');

const createProductCard = (product) => {
  const li = document.createElement('li');
  li.classList.add('store__item');
  li.insertAdjacentHTML('beforeend', `
    <article class="store__product product">
      <img class="product__img" src="${API_URL}${product.photoUrl}" alt="${product.name}" width="388" height="261">
      <h3 class="product__title">${product.name}</h3>
      <p class="product__price">${product.price}&nbsp;₽</p>
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

const fetchProduct = async (category) => {
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

fetchProduct();

const categoryBtns = document.querySelectorAll('.store__categories-btn');
const storeTitle = document.querySelector('.store__title');

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

const changeActiveBtn = ({target}) => {
  categoryBtns.forEach(btn => {
    btn.classList.remove('store__categories-btn_active');
  });

  target.classList.add('store__categories-btn_active');
  const category = target.dataset.category;
  changeTitle(category);
  fetchProduct(category);
};

categoryBtns.forEach(btn => {
  btn.addEventListener('click', changeActiveBtn);
});