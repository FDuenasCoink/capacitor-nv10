# capacitor-nv10

Plugin to control nv10 validator from capacitor

## Install

```bash
npm install capacitor-nv10
npx cap sync
```

## API

<docgen-index>

* [`modifyChannel(...)`](#modifychannel)
* [`checkDevice()`](#checkdevice)
* [`connect()`](#connect)
* [`testStatus()`](#teststatus)
* [`init()`](#init)
* [`startReader()`](#startreader)
* [`stopReader()`](#stopreader)
* [`reject()`](#reject)
* [`addListener('billInsert', ...)`](#addlistenerbillinsert)
* [`addListener('billInsertWarning', ...)`](#addlistenerbillinsertwarning)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### modifyChannel(...)

```typescript
modifyChannel(channelData: ChannelData) => Promise<ChannelInfo>
```

Funtion to activate/deactivate channels

| Param             | Type                                                |
| ----------------- | --------------------------------------------------- |
| **`channelData`** | <code><a href="#channeldata">ChannelData</a></code> |

**Returns:** <code>Promise&lt;<a href="#channelinfo">ChannelInfo</a>&gt;</code>

--------------------


### checkDevice()

```typescript
checkDevice() => Promise<ResponseStatus>
```

Function use to test the device.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### connect()

```typescript
connect() => Promise<ResponseStatus>
```

Function use to test the connection.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### testStatus()

```typescript
testStatus() => Promise<DeviceStatus>
```

Check device status.

**Returns:** <code>Promise&lt;<a href="#devicestatus">DeviceStatus</a>&gt;</code>

--------------------


### init()

```typescript
init() => Promise<void>
```

Setup Azkoyen connection.

--------------------


### startReader()

```typescript
startReader() => Promise<ResponseStatus>
```

Start the coin reader.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### stopReader()

```typescript
stopReader() => Promise<ResponseStatus>
```

Stop the coin reader.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### reject()

```typescript
reject() => Promise<ResponseStatus>
```

Funtion to rest de device.

**Returns:** <code>Promise&lt;<a href="#responsestatus">ResponseStatus</a>&gt;</code>

--------------------


### addListener('billInsert', ...)

```typescript
addListener(eventName: 'billInsert', listenerFunc: (event: BillEvent) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

Listens for coin read.

| Param              | Type                                                                |
| ------------------ | ------------------------------------------------------------------- |
| **`eventName`**    | <code>'billInsert'</code>                                           |
| **`listenerFunc`** | <code>(event: <a href="#billevent">BillEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('billInsertWarning', ...)

```typescript
addListener(eventName: 'billInsertWarning', listenerFunc: (event: BillEventWarning) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'billInsertWarning'</code>                                                  |
| **`listenerFunc`** | <code>(event: <a href="#billeventwarning">BillEventWarning</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all listeners

--------------------


### Interfaces


#### ChannelInfo

| Prop           | Type                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`channels`** | <code>{ 1000?: boolean; 2000?: boolean; 5000?: boolean; 10000?: boolean; 20000?: boolean; 50000?: boolean; }</code> |


#### ChannelData

| Prop          | Type                 |
| ------------- | -------------------- |
| **`channel`** | <code>number</code>  |
| **`active`**  | <code>boolean</code> |


#### ResponseStatus

| Prop             | Type                |
| ---------------- | ------------------- |
| **`statusCode`** | <code>number</code> |
| **`message`**    | <code>string</code> |


#### DeviceStatus

| Prop                | Type                |
| ------------------- | ------------------- |
| **`version`**       | <code>string</code> |
| **`device`**        | <code>number</code> |
| **`errorType`**     | <code>number</code> |
| **`errorCode`**     | <code>number</code> |
| **`message`**       | <code>string</code> |
| **`aditionalInfo`** | <code>string</code> |
| **`priority`**      | <code>number</code> |
| **`date`**          | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### BillEvent

| Prop        | Type                                            |
| ----------- | ----------------------------------------------- |
| **`error`** | <code>{ code: number; message: string; }</code> |
| **`value`** | <code>number</code>                             |


#### BillEventWarning

| Prop          | Type                |
| ------------- | ------------------- |
| **`message`** | <code>string</code> |
| **`code`**    | <code>number</code> |


### Type Aliases


#### Channels

<code>1000 | 2000 | 5000 | 10000 | 20000 | 50000 | 10000</code>

</docgen-api>
