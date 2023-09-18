import { WebPlugin } from '@capacitor/core';

import type { NV10Plugin } from './definitions';

export class NV10Web extends WebPlugin implements NV10Plugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
