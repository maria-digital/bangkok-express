import ProductCard from './ProductCard.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = document.createElement('div');
    this.elem.classList.add('products-grid');
    this.render(products);
  }

  render(products) {
    const cards = products.map(product => new ProductCard(product));
     this.elem.innerHTML = `
    <div class="products-grid">
    <div class="products-grid__inner">
        
    </div>
    </div>
    `;

    const inner = this.elem.querySelector('.products-grid__inner');
    cards.forEach((card) => inner.append(card.elem));
  }

  updateFilter(filters) {
    this.filters = Object.assign(this.filters, filters); //{...this.filters, ...filters};

    let productFilter = this.products;
    if (this.filters.noNuts === true) {  
      productFilter = productFilter.filter((product) => !product.nuts);
    }

    if (this.filters.vegeterianOnly === true) {  
      productFilter = productFilter.filter((product) => product.vegeterian);
    }

    if (this.filters.maxSpiciness) {  
      productFilter = productFilter.filter((product) => (product.spiciness <= this.filters.maxSpiciness));
    }

    if (this.filters.category) {  
      productFilter = productFilter.filter((product) => product.category === this.filters.category);
    }

    return this.render(productFilter);
  }

}