interface Handlers extends Partial<GlobalEventHandlers> {}

export class Controller {
  private readonly OPTION_CONTAINER_ID = 'dispenser-option-container';
  private CONTENT_WIDTH = '0px';
  private container?: HTMLElement;

  private options = {
    cardStuck:  false,
    recyclingBoxFull: false,
    cardInGate: false,
    cardsInDispenser: true,
    dispenserFull: false,
  };

  init() {
    this.render();
  }

  getDispenserFlags() {
    return this.options;
  }

  private render() {
    const expandBtn = this.generateExpandButton();
    const options = this.generateOptions();
    const container = this.generateContainer();
    container.appendChild(options);
    container.appendChild(expandBtn);
    this.container = container;
    document.body.appendChild(container);
    this.toggleContent();
  }

  private toggleContent() {
    if (!this.container) return;
    if (this.container.style.left !== '0px') {
      this.container.style.left = '0px';
    } else {
      this.container.style.left = `-${this.CONTENT_WIDTH}`;
    }
  }

  private generateContainer() {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '0px';
    div.style.top = '50%';
    div.style.transform = 'translateY(-50%)';
    div.style.background = '#white';
    div.style.height = '300px';
    div.style.borderRadius = '0px 20px 20px 0px';
    div.style.display = 'flex';
    div.style.transition = '.2s all ease-in-out';
    div.style.overflow = 'hidden';
    return div;
  }

  private generateExpandButton() {
    const btn = document.createElement('button');
    btn.style.width = '30px';
    btn.style.height = '100%';
    btn.style.background = '#004B40';
    btn.style.color = 'white';
    btn.style.position = 'relative';

    const span = document.createElement('span');
    span.style.color = 'white';
    span.style.fontWeight = '700';
    span.style.writingMode = 'vertical-lr';
    span.style.textOrientation = 'upright'
    span.innerText = 'DISPENSER FLAGS';

    btn.appendChild(span);
    btn.onclick = this.toggleContent.bind(this);
    return btn;
  }

  private generateOptions() {
    const div = document.createElement('ion-list');
    div.id = this.OPTION_CONTAINER_ID;
    div.style.width = '250px';
    this.CONTENT_WIDTH = div.style.width;
    Object.entries(this.options).forEach(([key, value]) => {
      const option = this.generateOption(key, value);
      div.appendChild(option);
    })
    return div;
  }

  private generateOption(labelText: string, value: boolean) {
    const container = document.createElement('ion-item');

    const label = document.createElement('ion-label');
    label.innerText = labelText;

    const check = document.createElement('ion-checkbox');
    check.checked = value;
    check.addEventListener('ionChange', (event) => {
      const checked = (event as CustomEvent).detail.checked;
      this.options = {
        ...this.options,
        [labelText]: checked,
      }
    });

    container.appendChild(label);
    container.appendChild(check);
    return container;
  }
}
