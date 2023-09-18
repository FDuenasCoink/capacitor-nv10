import { app } from 'electron';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export function deepClone<T>(object: Record<string, T>): Record<string, T> {
  return JSON.parse(JSON.stringify(object));
}

export function getCapacitorElectronConfig<T = Record<string, any>>(pluginName: string) {
  let capFileConfig: any = {};
  if (existsSync(join(app.getAppPath(), 'build', 'capacitor.config.js'))) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    capFileConfig = require(join(app.getAppPath(), 'build', 'capacitor.config.js')).default;
  } else {
    capFileConfig = JSON.parse(readFileSync(join(app.getAppPath(), 'capacitor.config.json')).toString());
  }
  const pluginConfig = capFileConfig.plugins?.[pluginName] ?? {};
  return deepClone(pluginConfig as Record<string, any>) as T;
}

export class PluginError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(`${message} (CÓDIGO ${code})`);
    this.code = code;
  }
}