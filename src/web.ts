import { WebPlugin } from "@capacitor/core";

import type { ChannelData, ChannelInfo, DeviceStatus, NV10Plugin, ResponseStatus } from "./definitions";
import { Validator } from './lib/Validator';
import { Logger } from './lib/logger';

export class Nv10PluginWeb extends WebPlugin implements NV10Plugin {
  private static readonly BILL_INSERT_EVENT = "billInsert";
  private logger = new Logger('NV10');
  private validator = new Validator({
    title: 'NV10',
    coins: [
      { value: 1_000 },
      { value: 2_000 },
      { value: 5_000 },
      { value: 10_000 },
      { value: 20_000 },
      { value: 50_000 },
      { value: 100_000 },
    ]
  });

  async modifyChannel(channelData: ChannelData): Promise<ChannelInfo> {
    this.logger.log('modifyChannel');
    const channels = this.validator.modifyChannel(channelData);
    return {
      statusCode: 200,
      message: 'web simulator',
      channels,
    }
  }

  async checkDevice(): Promise<ResponseStatus> {
    this.logger.log('checkDevice');
    return {
      statusCode: 200,
      message: 'web simulator',
    }
  }

  async connect(): Promise<ResponseStatus> {
    this.logger.log('connect');
    return {
      statusCode: 200,
      message: 'web simulator',
    }
  }

  async testStatus(): Promise<DeviceStatus> {
    this.logger.log('tes status simulated');
    return {
      version: '1',
      device: 1,
      errorType: 0,
      errorCode: 0,
      message: "web simulated response",
      aditionalInfo: "",
      priority: 0,
      date: new Date().toISOString(),
    }
  }

  async init(): Promise<void> {
    this.logger.log('setup web');
    return;
  }

  async startReader(): Promise<ResponseStatus> {
    this.logger.log('start reader');
    this.validator.mount();
    this.validator.resetChannels();
    this.validator.onCoinInsert((event) => {
      this.notifyListeners(Nv10PluginWeb.BILL_INSERT_EVENT, event);
    });
    return {
      statusCode: 200,
      message: "web simulator"
    };
  }

  async stopReader(): Promise<ResponseStatus> {
    this.logger.log('stop reader');
    this.validator.unmount();
    return {
      statusCode: 200,
      message: "web simulator"
    };
  }

  async reject(): Promise<ResponseStatus> {
    this.logger.log('reject');
    return {
      statusCode: 200,
      message: "web simulator"
    };
  }

}
