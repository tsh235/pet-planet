import { fetchProducts } from './js/api';
import { addToCart } from './js/cart';

import elems from './js/elems';
const {
  storeTitle,
  categoryBtns,
  storeList,
} = elems;

const init = () => {
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
    fetchProducts(category);
  };
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', changeCategory);
  });
  
  storeList.addEventListener('click', ({target}) => {
    if (target.closest('.product__btn-add-cart')) {
      const productId = target.dataset.id;
      addToCart(productId);
    }
  });
  
  fetchProducts();
}

init();