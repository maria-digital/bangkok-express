import Carousel from '/js/index6.js';
import slides from '/js/slides6.js';

import RibbonMenu from '/js/index7-1.js';
import categories from '/js/categories7-1.js';

import StepSlider from '/js/index7-4.js';
import ProductsGrid from '/js/index8-2.js';

import CartIcon from '/js/index8-1.js';
import Cart from '/js/index8-4.js';

export default class Main {

  constructor() {}

  async render() {
    let response = await fetch('products.json');
    let result = await response.json();
    this.productsGrid = new ProductsGrid(result);
    let productsGridHolder = document.querySelector('[data-products-grid-holder]');
    productsGridHolder.innerHTML = '';
    productsGridHolder.append(this.productsGrid.elem);
    this.Carousel = new Carousel(slides);
    let carouselHolder = document.querySelector('[data-carousel-holder]');
    carouselHolder.append(this.Carousel.elem);
    this.ribbonMenu = new RibbonMenu(categories);
    let ribbonHolder = document.querySelector('[data-ribbon-holder]');
    ribbonHolder.append(this.ribbonMenu.elem);
    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3
    });
    let sliderHolder = document.querySelector('[data-slider-holder]');
    sliderHolder.append(this.stepSlider.elem);
    this.CartIcon = new CartIcon();
    let cartIconHolder = document.querySelector('[data-cart-icon-holder]');
    cartIconHolder.append(this.CartIcon.elem);
    this.cart = new Cart(this.CartIcon);
    document.body.addEventListener('product-add', ({
      detail: productId
    }) => {
      let product = result.find(product => product.id == productId);
      this.cart.addProduct(product);
    });

    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });

    this.stepSlider.elem.addEventListener('slider-change', ({
      detail: value
    }) => {
      this.productsGrid.updateFilter({
        maxSpiciness: value
      });
    });

    this.ribbonMenu.elem.addEventListener('ribbon-select', ({
      detail: categoryId
    }) => {
      this.productsGrid.updateFilter({
        category: categoryId
      });
    });
    document.getElementById('nuts-checkbox').onchange = event => {
      this.productsGrid.updateFilter({
        noNuts: document.getElementById('nuts-checkbox').checked,
      });
    };
    document.getElementById('vegeterian-checkbox').onchange = event => {
      this.productsGrid.updateFilter({
        vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      });
    };
  }
}