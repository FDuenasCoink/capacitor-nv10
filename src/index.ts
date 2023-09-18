import { registerPlugin } from '@capacitor/core';

import type { NV10Plugin } from './definitions';

const NV10 = registerPlugin<NV10Plugin>('NV10', {
  web: () => import('./web').then(m => new m.NV10Web()),
});

export * from './definitions';
export { NV10 };
