import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = document.createElement('div');
    this.elem.classList.add("ribbon");
    this.render(this.elem, categories);
    this.menuCarusel();
    let active = this.elem.querySelectorAll('.ribbon__item_active');
    for (let elem of active) {
      elem.classList.remove("ribbon__item_active");
    }
    let category = this.elem.querySelectorAll('.ribbon__item');
    for (let elem of category) {
      elem.addEventListener('click', (event) => this.onClick(event));
    };
  }


  render(elem, categories) {
    const list = categories.map(value => `
    <a href="#" class="ribbon__item ribbon__item_active" data-id="${value.id}">${value.name}</a>
      `).join('');
    elem.innerHTML = `
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <div class="ribbon__inner">
        ${list}
      </div>
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    `;
  }


  menuCarusel() {
    let rightCarousel = this.elem.querySelector('.ribbon__arrow_right');
    let leftCarousel = this.elem.querySelector('.ribbon__arrow_left');
    let ribbonInner = this.elem.querySelector('.ribbon__inner');
     leftCarousel.addEventListener("click", function () {
      ribbonInner.scrollBy(-350, 0);
    });
    rightCarousel.addEventListener("click", function () {
      ribbonInner.scrollBy(350, 0);
    });

    ribbonInner.addEventListener("scroll", function () {
      let scrollLeft = ribbonInner.scrollLeft;
      let  scrollWidth = ribbonInner.scrollWidth;
      let  clientWidth = ribbonInner.clientWidth;
      let  scrollRight = scrollWidth - scrollLeft - clientWidth;
      if (scrollLeft > 0) {
        leftCarousel.classList.add("ribbon__arrow_visible");
      } else {
        leftCarousel.classList.remove("ribbon__arrow_visible");
      }
      if (scrollRight < 1) {
        rightCarousel.classList.remove("ribbon__arrow_visible");
      } else {
        rightCarousel.classList.add("ribbon__arrow_visible");
      }
    });
  }
  onClick(event) {
    event.preventDefault();
    let category = event.target.closest('.ribbon__item');
    let id = category.dataset.id;
    let active = this.elem.querySelectorAll('.ribbon__item_active');
    for (let elem of active) {
      elem.classList.remove("ribbon__item_active");
    }
    category.classList.add("ribbon__item_active");
    this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
      detail: id,
      bubbles: true
    }));
  }
}
