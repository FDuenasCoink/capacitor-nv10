interface Coin {
  value: number;
}

interface ValidatorOptions {
  title?: string;
  coins: Coin[];
}

export interface CoinEvent {
  error?: { code: number, message: string };
  value: number;
}

export interface ChannelData {
  channel: number;
  active: boolean;
}

export class Validator {
  private readonly CONTAINER_ID = 'validator-container';

  private title: string;
  private coins: { value: number, active: boolean }[] = [];
  private readonly initCoins: { value: number, active: boolean }[];
  private mounted = false;
  private callback?: (event: CoinEvent) => void;

  constructor(options: ValidatorOptions) {
    this.coins = options.coins.map((coin) => ({ ...coin, active: true }));
    this.initCoins = this.coins;
    this.title = options.title ?? 'Validator';
  }

  render(): void {
    if (!this.mounted) return;
    const c = document.getElementById(this.CONTAINER_ID);
    if (c) document.body.removeChild(c);
    const grid = this.generateGrid();
    const buttons = this.coins.map(coin => {
      const btn = this.generateButton(coin.value, { disabled: !coin.active });
      btn.onclick = () => {
        this.callback?.({ value: coin.value });
      }
      return btn;
    });
    for (const btn of [...buttons, this.generateErrorBtn()]) {
      grid.appendChild(btn);
    }
    const container = this.generateContainer();
    const title = this.generateTitle();
    container.appendChild(title);
    container.appendChild(grid);
    document.body.appendChild(container);
  }

  mount(): void {
    this.mounted = true;
    this.render();
  }

  unmount(): void {
    this.mounted = false;
    this.callback = undefined;
    const container = document.getElementById(this.CONTAINER_ID);
    if (!container) return;
    document.body.removeChild(container);
  }

  onCoinInsert(callback: (event: CoinEvent) => void): void {
    this.callback = callback;
  }

  modifyChannel(channel: ChannelData) {
    const idx = this.coins.findIndex((c) => c.value === channel.channel);
    if (idx !== -1) {
      this.coins[idx].active = channel.active;
    }
    this.render();
    return this.coins.reduce<{[key: number]: boolean}>((obj, curr) => {
      obj[curr.value] = curr.active;
      return obj;
    }, {});
  }

  resetChannels(): { value: number; active: boolean }[] {
    this.coins = this.initCoins;
    return this.coins;
  }

  private generateContainer() {
    const container = document.createElement('div');
    container.id = this.CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.top = '0px';
    container.style.left = '50%';
    container.style.background = 'rgba(250, 250, 250, .7)';
    // @ts-ignore
    container.style.backdropFilter = 'blur(2px)';
    container.style.padding = '8px';
    container.style.transform = 'translateX(-50%)';
    container.style.borderRadius = '0px 0px 10px 10px';
    return container;
  }

  private generateTitle() {
    const title =  document.createElement('h6');
    title.style.margin = '0px';
    title.style.fontFamily = 'var(--font-family-primary)';
    title.style.color = 'var(--ion-color-secondary)';
    title.style.textAlign = 'center';
    title.style.marginBottom = '8px';
    title.style.fontSize = '12px';
    title.style.fontWeight = '600';
    title.innerText = this.title;
    return title;
  }

  private generateGrid() {
    const grid = document.createElement('div');
    grid.style.display = 'flex';
    grid.style.gap = '10px';
    return grid
  }

  private generateErrorBtn() {
    const button = this.generateButton('E');
    button.style.background = 'red';
    button.onclick = () => {
      const error = { code: 0, message: 'web simulated error' };
      this.callback?.({ error, value: 0 });
    }
    return button;
  }

  private generateButton(value: string | number, options?: { disabled?: boolean }) {
    const btn = document.createElement('button');
    btn.disabled = options?.disabled ?? false;
    btn.innerText = `${value}`;
    btn.style.width = '35px';
    btn.style.height = '35px';
    btn.style.display = 'block';
    btn.style.borderRadius = '50%';
    btn.style.color = '#FFFFFF';
    btn.style.background = '#004B40';
    btn.style.fontSize = '8px';
    btn.style.fontWeight = '700';
    if (options?.disabled) {
      btn.style.opacity = '.6';
    }
    return btn;
  }
}
