const cartSection = document.querySelector('ol'); // * Requisito 4
const priceSave = document.querySelector('.total-price'); // * Requisito 5

// * Requisito 4.1
const localSave = () => {
  localStorage.setItem('chave', cartSection.innerHTML);
  localStorage.setItem('priceKey', priceSave.innerText); // * Requisito 5
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // * Requisito 1
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) { // * Requisito 2
  return item.querySelector('span.item__sku').innerText;
}

// * Requisito 5
const updateTotalPrice = (total) => {
  priceSave.innerText = total;
};

// * Requisito 5.1
const addPrice = (price) => {
  let totalPriceSpan = priceSave.innerText;
  totalPriceSpan = Math.round((Number(totalPriceSpan) * 100) + (price * 100)) / 100;
  updateTotalPrice(totalPriceSpan);
};

// * Requisito 5.2
const removePrice = (price) => {
  let totalPriceSpan = priceSave.innerText;
  totalPriceSpan = Math.round((Number(totalPriceSpan) * 100) - (price * 100)) / 100;
  updateTotalPrice(totalPriceSpan);
};

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.parentElement.removeChild(cartItem); // * Requisito 3
  const priceItemString = cartItem.innerText.split('$')[1];
  const priceItemNumber = parseFloat(priceItemString);
  removePrice(priceItemNumber); // * Requisito 5.2
  localSave(); // * Requisito 4.1
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // * Requisito 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// * Requisito 7.1
const addLoading = () => {
  const load = document.createElement('h1');
  load.innerHTML = 'Loading...';
  load.className = 'loading';
  document.body.appendChild(load);
};

// * Requisito 7.2
const removeLoading = () => {
  document.querySelector('.loading').remove();
};

// * Requisito 1
const createProductList = async () => {
  addLoading(); // * Requisito 7.1
  const responseFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseFetch.json();
  removeLoading(); // * Requisito 7.2
  responseJson.results.forEach((element) => {
    const { id, title, thumbnail } = element;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const itemsList = document.querySelector('.items');
    itemsList.appendChild(item);
  });
};

// * Requisito 2
const addProductShoppingCart = async () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement); // ref.: https://stackoverflow.com/questions/29168719/can-you-target-an-elements-parent-element-using-event-target
      const responseFetch = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
      const responseJson = await responseFetch.json();
      const liProducts = createCartItemElement(responseJson);
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(liProducts);
      addPrice(responseJson.price); // * Requisito 5.1
      localSave(); // * Requisito 4.1
    });
  });
};

// * Requisito 6
const emptyCart = () => {
  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', () => {
    cartSection.innerHTML = '';
    let emptyPrice = priceSave.innerHTML;
    emptyPrice = 0;
    updateTotalPrice(emptyPrice);
    localSave(); // * Requisito 4.1
  });
};

// * Requisito 4.2
const getLocal = () => {
  cartSection.innerHTML = localStorage.getItem('chave');
  const cartItem2 = document.querySelectorAll('.cart__item');
  cartItem2.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  priceSave.innerHTML = localStorage.getItem('priceKey'); // * Requisito 5
};

window.onload = async () => {
  await createProductList(); // * Requisito 1
  await addProductShoppingCart(); // * Requisito 2
  getLocal(); // * Requisito 4.2
  emptyCart(); // * Requisito 6
};
