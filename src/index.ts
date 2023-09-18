import { registerPlugin } from '@capacitor/core';

import type { NV10PluginElectron } from './definitions';

const NV10 = registerPlugin<NV10PluginElectron>('NV10', {
  web: () => import('./web').then(m => new m.Nv10PluginWeb()),
  electron: () => (window as any).CapacitorCustomPlatform.plugins.NV10,
});

export * from './definitions';
export { NV10 };
