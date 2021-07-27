export default class ProductCard {
  constructor(product) {
    this.elem = document.createElement('div');
    this.elem.className = 'card';
    this.product = product;
    this.elem.addEventListener('click', this.onButtonClick);
    this.render(product);
  }

  onButtonClick = (event) => {
    const target = event.target;

    if (target.closest('.card__button')) {
      const event = new CustomEvent("product-add", {
        bubbles: true,
        detail: this.product.id
      });
      this.elem.dispatchEvent(event);

    }
  }

  render(product) {
    this.elem.innerHTML = `
    <div class="card__top">
      <img src="assets/images/products/${product.image}" class="card__image" alt="product">
        <span class="card__price">€${product.price.toFixed(2)}</span>
    </div>
    <div class="card__body">
        <div class="card__title">${product.name}</div>
        <button type="button" class="card__button">
            <img src="assets/images/icons/plus-icon.svg" alt="icon">
        </button>
    </div>
    `;
  }
}