import { NV10 as NV10Addon } from '@fduenascoink/nv10-addon';
import type { Bill, INV10, UnsubscribeFunc } from '@fduenascoink/nv10-addon';
import { app } from 'electron';
import { EventEmitter } from 'events';
import { join } from 'path';

import type { ChannelData, ChannelInfo, DeviceStatus, NV10Plugin, ResponseStatus } from '../../src/definitions';

import { CoinChannels } from './channels';
import { PluginError, getCapacitorElectronConfig } from "./utils";

export class NV10 extends EventEmitter implements NV10Plugin {
  private static readonly BILL_INSERT_EVENT = "billInsert";
  private static readonly BILL_WARNING_EVENT = "billInsertWarning";

  private nv10: INV10;
  private channels = new CoinChannels();
  private unsubscribeFn?: UnsubscribeFunc;
  private stackingTimer = 0;

  constructor() {
    super();
    const config = getCapacitorElectronConfig('NV10');
    const logsPath = app.getPath('documents');
    this.nv10 = new NV10Addon({
      maximumPorts: config.maximumPorts ?? 10,
      logLevel: config.logLevel ?? 1,
      logPath: join(logsPath, 'oink-logs', 'nv10.log'),
    });
  }

  async init(): Promise<void> {
    await this.connect();
    await this.checkDevice();
  }

  async connect(): Promise<ResponseStatus> {
    const response = this.nv10.connect();
    const status = response.statusCode;
    if (status !== 200) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async checkDevice(): Promise<ResponseStatus> {
    const response = this.nv10.checkDevice();
    const status = response.statusCode;
    if (status !== 201) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async reject(): Promise<ResponseStatus> {
    const response = this.nv10.reject();
    const status = response.statusCode;
    if (status !== 206) {
      throw new PluginError(response.message, response.statusCode);
    }
    return response;
  }

  async testStatus(): Promise<DeviceStatus> {
    const status = this.nv10.testStatus();
    return {
      ...status,
      date: new Date().toISOString(),
    }
  }

  async modifyChannel(channelData: ChannelData): Promise<ChannelInfo> {
    const { channel, active } = channelData;
    this.channels.setChannel(channel, active);
    const { mask1 } = this.channels.getValue();
    const response = this.nv10.modifyChannels(mask1);
    const status = response.statusCode;
    if (status !== 204) {
      throw new PluginError(response.message, response.statusCode);
    }
    const channels = this.channels.state;
    return { ...response, channels };
  }

  async startReader(): Promise<ResponseStatus> {
    await this.unsubscribe();
    const response = this.nv10.startReader();
    const status = response.statusCode;
    if (status !== 200 && status !== 203) {
      throw new PluginError(response.message, response.statusCode);
    }
    this.channels.reset();
    this.unsubscribeFn = this.nv10.onBill((bill) => this.notifyBill(bill));
    return response;
  }
  
  async stopReader(): Promise<ResponseStatus> {
    await this.unsubscribe();
    const response = this.nv10.startReader();
    const status = response.statusCode;
    if (status !== 202 && status !== 203) {
      throw new PluginError(response.message, response.statusCode);
    }
    this.channels.reset();
    return response;
  }

  private async notifyBill(bill: Bill) {
    const status = bill.statusCode;
    if (status === 302) return;

    if (status === 508) {
      const event = { value: bill.bill };
      const error = { code: bill.statusCode, message: bill.message };
      this.emit(NV10.BILL_INSERT_EVENT, event);
      this.emit(NV10.BILL_INSERT_EVENT, { error, value: 0 });
      await this.unsubscribe();
      return
    }

    if (status >= 400) {
      const error = { code: bill.statusCode, message: bill.message };
      this.emit(NV10.BILL_INSERT_EVENT, { error, value: 0 });
      await this.unsubscribe();
      return;
    }

    const warningsCodes = [305, 306, 311];
    if (warningsCodes.includes(status)) {
      const warning = { message: bill.message, code: bill.statusCode };
      this.emit(NV10.BILL_WARNING_EVENT, warning);
      return;
    }

    if (status === 307) {
      const warning = { message: bill.message, code: bill.statusCode };
      this.emit(NV10.BILL_WARNING_EVENT, warning);
      this.stackingTimer = Date.now();
      return;
    }

    if (status === 308 || status === 312) {
      this.stackingTimer = 0;
      const event = { value: bill.bill };
      this.emit(NV10.BILL_INSERT_EVENT, event);
      return;
    }

    if (this.stackingTimer !== 0) {
      const currentTime = Date.now();
      const difference = currentTime - this.stackingTimer;
      if (difference < 10_000) return;
      try {
        await this.reject();
        this.stackingTimer = 0;
      } catch (error) {
        if (error instanceof PluginError) {
          const errorData = { message: error.message, code: error.code };
          this.emit(NV10.BILL_INSERT_EVENT, { error: errorData });
          await this.unsubscribe();
          return
        }
        const errorData = { message: 'unknown error', code: 0 };
        this.emit(NV10.BILL_INSERT_EVENT, { error: errorData });
      }
    }
  }

  // @ts-ignore
  addListener(event: string | symbol, listener: (...args: any[]) => void): any {
    return super.addListener(event, listener);
  }

  // @ts-ignore
  removeAllListeners(event?: string | symbol): any {
    return super.removeAllListeners(event);
  }

  // @ts-ignore
  removeListener(event: string | symbol, listener: (...args: any[]) => void): any {
    return super.removeListener(event, listener);
  }

  private sleep() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  private async unsubscribe() {
    if (!this.unsubscribeFn) return;
    this.unsubscribeFn?.();
    this.unsubscribeFn = undefined;
    await this.sleep();
  }

}