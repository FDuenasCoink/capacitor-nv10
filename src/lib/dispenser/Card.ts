export class Card {
  private readonly CARD_HEIGHT = 350;
  private readonly DISPENSE_POS = 130;
  private readonly CARD_ID = 'dispenser-simulated-card';

  private initYpos?: number;
  private actualYpos = 0;
  private card?: HTMLElement;
  private dispensed = false;
  private callback?: () => void;

  init() {
    this.render();
  }

  private render() {
    this.dispensed = false;
    const oldCard = document.getElementById(this.CARD_ID);
    if (oldCard) {
      document.body.removeChild(oldCard);
    }
    const card = document.createElement('div');
    card.id = this.CARD_ID;
    card.style.position = 'fixed';
    card.style.left = '50%'
    card.style.transform = 'translateX(-50%)';
    card.style.top = `${this.calculatePos(0)}px`;
    card.style.height = `${this.CARD_HEIGHT}px`;
    card.style.transition = '.3s all ease-in-out';

    card.ontouchmove = this.handleMove.bind(this);
    card.ontouchend = this.handleTouchEnd.bind(this);

    const img = document.createElement('img');
    img.src = '/assets/plugins/visa-fisica.png';
    img.style.height = '100%';

    card.appendChild(img);
    document.body.appendChild(card);
    this.card = card;
    return card;
  }

  async dispense(callback?: () => void) {
    if (!this.card) {
      throw new Error('card didnt init');
    }
    this.dispensed = true;
    this.callback = callback;
    const pos = this.calculatePos(this.DISPENSE_POS);
    await this.setPosition(pos, { tansitionTime: 1 });
  }

  private handleMove = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    if (!this.initYpos) {
      this.initYpos = touch.pageY;
    }
    const pos = touch.pageY;
    const deltaY = pos - this.initYpos;
    this.moveCard(deltaY);
  }

  private handleTouchEnd = () => {
    this.initYpos = undefined;
    this.setPosition(this.actualYpos);
  }

  private handleCardTaken = (lastPost: number) => {
    if (!this.card) return;
    this.card.ontouchend = null;
    this.card.ontouchmove = null;
    this.callback?.();
    this.card.style.transition = '.7s all ease-in-out';
    this.card.style.opacity = '0';
    this.card.ontransitionend = () => {
      this.render();
      this.callback = undefined;
    }
  }

  async recycle() {
    if (!this.dispensed) {
      throw new Error('no dispensed card detected');
    }
    if (!this.card) return;
    this.card.ontouchend = null;
    this.card.ontouchmove = null;
    const pos = this.calculatePos(0);
    await this.setPosition(pos, { tansitionTime: 1 });
    this.render();
  }

  private calculatePos(pos: number) {
    const calculatedPos = pos - this.CARD_HEIGHT;
    return calculatedPos;
  }

  private setPosition(pos: number, options?: { tansitionTime?: number }) {
    return new Promise<void>(resolve => {
      if (!this.card) return;
      this.card.style.transition = `${options?.tansitionTime ?? 0.25}s all ease-in-out`;
      this.card.style.top = `${pos}px`;
      this.actualYpos = pos;
      this.card.ontransitionend = () => {
        if (this.card) this.card.ontransitionend = null;
        resolve();
      }
    });
  }

  private moveCard(deltaY: number) {
    if (!this.card) return;
    this.card.style.transition = 'none';
    const pos = this.actualYpos + deltaY;
    if (pos > 50) {
      this.handleCardTaken(pos);
      return;
    }
    this.card.style.top = `${pos}px`;
  }
}
