import { WebPlugin } from "@capacitor/core";

import type { ChannelData, ChannelInfo, DeviceStatus, NV10Plugin, ResponseStatus } from "./definitions";

export class Nv10PluginWeb extends WebPlugin implements NV10Plugin {
  
  modifyChannel(channelData: ChannelData): Promise<ChannelInfo> {
    console.log(channelData);
    throw new Error("Method not implemented.");
  }

  checkDevice(): Promise<ResponseStatus> {
    throw new Error("Method not implemented.");
  }

  connect(): Promise<ResponseStatus> {
    throw new Error("Method not implemented.");
  }

  testStatus(): Promise<DeviceStatus> {
    throw new Error("Method not implemented.");
  }

  init(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  startReader(): Promise<ResponseStatus> {
    throw new Error("Method not implemented.");
  }

  stopReader(): Promise<ResponseStatus> {
    throw new Error("Method not implemented.");
  }

  reject(): Promise<ResponseStatus> {
    throw new Error("Method not implemented.");
  }

}
