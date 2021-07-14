import createElement from '../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.elem = document.createElement('div');
    this.elem.classList.add("carousel");
    this.render(this.elem, slides);
    let button = this.elem.querySelectorAll('.carousel__button');
    for (let elem of button) {
      elem.addEventListener('click', (event) => this.onClick(event));
    };
    this.carusel();
  }
  render(caruselInner, slides) {
    const list = slides.map(value => `
        <div class="carousel__slide" data-id=${value.id}>
        <img src="../assets/images/carousel/${value.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
        <span class="carousel__price">€${Number(value.price).toFixed(2)}</span>
        <div class="carousel__title">${value.name}</div>
        <button type="button" class="carousel__button">
        <img src="../assets/images/icons/plus-icon.svg" alt="icon">
        </button>
        </div>
        </div>
      `).join('');
    caruselInner.innerHTML = `<div class="carousel__arrow carousel__arrow_right"><img src="/assets/images/icons/angle-icon.svg" alt="icon"></div>
    <div class="carousel__arrow carousel__arrow_left"> <img src="/assets/images/icons/angle-left-icon.svg" alt="icon"></div>
    <div class="carousel__inner"> ${list}</div>`;

  }

  onClick(event) {
    let slide = event.target.closest('.carousel__slide');
    let id = slide.dataset.id;
    this.elem.dispatchEvent(new CustomEvent("product-add", {
      detail: id,
      bubbles: true
    }));
  }

  carusel() {
    let leftCarousel = this.elem.querySelectorAll('.carousel__arrow_left')[0];
    let rightCarousel = this.elem.querySelectorAll('.carousel__arrow_right')[0];
    let carouselInner = this.elem.querySelectorAll('.carousel__inner')[0];
    let carouselCount = null;
    let numberSlide = 1;
    let carouselSlide = this.elem.querySelectorAll('.carousel__slide');
    let carouselSlideLenght = carouselSlide.length;
    let count = carouselSlide[0];
    leftCarousel.style.display = 'none';
    rightCarousel.addEventListener("click", function () {
      carouselInner.style.transform = 'translateX(-' + (count.offsetWidth * numberSlide) + 'px)';
      numberSlide++;
      leftCarousel.style.display = '';
      if (numberSlide === Number(carouselSlideLenght)) {
        rightCarousel.style.display = 'none';
      }
    });
    leftCarousel.addEventListener("click", function () {
      let numberSlideLeft = numberSlide === 2 ? 0 : (numberSlide - 2);
      carouselInner.style.transform = 'translateX(-' + (numberSlideLeft * count.offsetWidth) + 'px)';
      numberSlide--;
      rightCarousel.style.display = '';
      if (numberSlide === 1) {
        leftCarousel.style.display = 'none';
      }
    });
  }
}