/// <reference types="@capacitor/cli" />
import type { PluginListenerHandle } from "@capacitor/core";

declare module '@capacitor/cli' {
  export interface PluginsConfig {
    NV10?: {
      maximumPorts?: number;
      logLevel?: number;
    }
  }
}

export interface ResponseStatus {
  statusCode: number;
  message: string;
}

export type Channels = 1000 | 2000 | 5000 | 10000 | 20000 | 50000 | 10000;

export interface ChannelData {
  channel: number;
  active: boolean;
}

export interface ChannelInfo extends ResponseStatus {
  channels: { [key in Channels]?: boolean };
}

export interface DeviceStatus {
  version: string;
  device: number;
  errorType: number;
  errorCode: number;
  message: string;
  aditionalInfo: string;
  priority: number;
  date: string;
}

export interface BillEvent {
  error?: { code: number, message: string };
  value: number;
}

export interface BillEventWarning {
  message: string;
  code: number;
}

export interface NV10Plugin {
  /**
   * Funtion to activate/deactivate channels
   */
  modifyChannel(channelData: ChannelData): Promise<ChannelInfo>;
  /**
   * Function use to test the device.
   */
  checkDevice(): Promise<ResponseStatus>;
  /**
   * Function use to test the connection.
   */
  connect(): Promise<ResponseStatus>;
  /**
   * Check device status.
   */
  testStatus(): Promise<DeviceStatus>;
  /**
   * Setup Azkoyen connection.
   */
  init(): Promise<void>;
  /**
   * Start the coin reader.
   */
  startReader(): Promise<ResponseStatus>;
  /**
   * Stop the coin reader.
   */
  stopReader(): Promise<ResponseStatus>;
  /**
   * Funtion to rest de device.
   */
  reject(): Promise<ResponseStatus>;
  /**
   * Listens for coin read.
   */
  addListener(eventName: 'billInsert', listenerFunc: (event: BillEvent) => void): Promise<PluginListenerHandle> & PluginListenerHandle | string;
  addListener(eventName: 'billInsertWarning', listenerFunc: (event: BillEventWarning) => void): Promise<PluginListenerHandle> & PluginListenerHandle | string;
  /**
   * Removes all listeners
   */
  removeAllListeners(): Promise<void>;
}

export interface NV10PluginElectron extends NV10Plugin {
  removeListener?(listenerId: string): void & Promise<void>;
  removeAllListeners(type?: string): void & Promise<void>;
}
