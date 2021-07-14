import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    let cartItem = this.cartItems.find(item => (item.product.id === product.id));

    if (cartItem) {
      cartItem.count++;
    } else {
      cartItem = {product: product, count: 1,};
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(item => (item.product.id === productId));
    cartItem.count += amount;
    if (cartItem.count === 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    };
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    if (this.cartItems.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getTotalCount() {
    let totalCount = this.cartItems.map(item => (item.count));
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return totalCount.reduce(reducer, 0);
  }

  getTotalPrice() {
    let price = this.cartItems.map(item => (item.product.price));
    let totalCount = this.cartItems.map(item => (item.count));
    return price.reduce(function(r,a,i) {return r + a * totalCount[i]},0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle("Your order");
      
    this.modalBody = document.createElement('div');
    this.cartItems.map(item => {
      this.modalBody.append(this.renderProduct(item.product, item.count))
    });
    this.modalBody.append(this.renderOrderForm());
    this.modal.setBody(this.modalBody);
    this.modal.open();

    document.querySelector('.cart-form').onsubmit = (event) => this.onSubmit(event);

    let cartCounters = this.modal.elem.querySelectorAll('.cart-counter__button');
    for (let cartCounter of cartCounters) {
      cartCounter.onclick = () => {
        let productId = cartCounter.closest('[data-product-id]').dataset.productId;

        if (cartCounter.classList.contains('cart-counter__button_minus')) {
          this.updateProductCount(productId, -1);
        }
        if (cartCounter.classList.contains('cart-counter__button_plus')) {
          this.updateProductCount(productId, 1);
        }
      }
    }

  }


  onProductUpdate(cartItem) {

    this.cartIcon.update(this);
    if (document.querySelector('body').classList.contains('is-modal-open')) {
      let productId = cartItem.product.id;
      
      let productCount = document.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = document.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let infoPrice = document.querySelector(`.cart-buttons__info-price`);
      
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.count * cartItem.product.price).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`; //.toFixed(2)
   
      if (this.cartItems.length === 0) {
        this.modal.close();
        return;
      }
      if (cartItem.count === 0) {
        document.querySelector(`[data-product-id="${productId}"]`).remove();
      } 
    }
    
  }

  onSubmit(event) {
    event.preventDefault();    
    let cartForm = document.querySelector('form');
    let formData = new FormData(cartForm);
    let loadingButton = document.querySelector('.cart-form button');
    loadingButton.classList.add('is-loading');
    let registerUrl = 'https://httpbin.org/post';

    fetch(registerUrl, {
      method: 'POST',
      body: formData,
    })
    .then((response) => {
      if (response.ok) {
        let body = createElement(`<div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>
      `);
        this.modal.setTitle('Success!');
        this.modal.setBody(body);
        this.cartItems = [];
        this.cartIcon.update(this);
      } else {
        
      }
    })
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}