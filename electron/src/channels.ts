export class CoinChannels {
  private channelBitState = [
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];

  private readonly channelsBits: { [key: number]: number[] }  = {
    1000: [1],
    2000: [2],
    5000: [3],
    10000: [4],
    20000: [5],
    50000: [6],
    100000: [7],
  }

  state: { [key: number]: boolean } = {
    1000: true,
    2000: true,
    5000: true,
    10000: true,
    20000: true,
    50000: true,
    100000: true,
  };

  setChannel(channel: number, active: boolean) {
    const channelBits = this.channelsBits[channel];
    if (!channelBits) return;
    this.channelBitState.forEach((channel, i) => {
      channel.forEach((_, j) => {
        const pos = i + j + 1;
        if (channelBits.includes(pos)) {
          this.channelBitState[i][j] = Number(active);
        }
      });
    });
    this.state[channel] = active;
  }

  getValue() {
    const mask1 = this.convertBitsToInt(this.channelBitState[0]);
    return { mask1 };
  }

  reset() {
    this.channelBitState.forEach((bits, i) => {
      bits.forEach((_, j) => {
        this.channelBitState[i][j] = 1;
      });
    });
    Object.keys(this.state).forEach(key => {
      this.state[Number(key)] = true;
    });
  }

  private convertBitsToInt(bits: number[]) {
    return parseInt(bits.join(''), 2);
  }
}