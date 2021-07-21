export default class Modal {
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add("modal");
    this.render();
    let buttonDel = this.elem.querySelector('.modal__close');
    buttonDel.addEventListener('click', (event) => this.onClickExit(event));
    document.body.addEventListener('keydown', (event) => this.onKeyDown(event));
  }
  render() {
    this.elem.innerHTML = `
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title"></h3>
      </div>
      <div class="modal__body"></div>
    </div>`;
  }
  open() {
    document.body.classList.add("is-modal-open");
    document.body.append(this.elem);
  }
  setTitle(heading) {
    let title = this.elem.querySelector('.modal__title');
    title.innerText = heading;
  }
  setBody(node) {
    let body = this.elem.querySelector('.modal__body');
    body.innerHTML = "";
    body.append(node);
  }
  close() {
    document.body.classList.remove("is-modal-open");
    this.elem.remove();
  }
  onClickExit(event) {
    document.body.classList.remove("is-modal-open");
    this.elem.remove();
  }
  onKeyDown(event) {
    let container = document.body.querySelector('.modal');
    if (event.code === 'Escape' && container) {
      document.body.classList.remove("is-modal-open");
      this.elem.remove();
    }
  }
}