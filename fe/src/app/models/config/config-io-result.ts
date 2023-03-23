export class ConfigIoResult<T> {
  data?: T;
  messages: ConfigIoMessage[] = [];

  withData(data: T) {
    this.data = data;
    return this;
  }

  withMessage(message: ConfigIoMessage) {
    this.messages.push(message);
    return this;
  }

  withMessages(messages: ConfigIoMessage[], prefix?: string) {
    this.messages.push(
      ...messages.map((msg) => {
        return { ...msg, message: `${prefix ?? ''}${msg.message}` };
      })
    );
    return this;
  }
}

export class ConfigIoMessage {
  type: ConfigIoMsgType;
  message: string;

  constructor(message: string, type: ConfigIoMsgType) {
    this.message = message;
    this.type = type;
  }
}

export enum ConfigIoMsgType {
  SUCCESS,
  WARNING,
  ERROR,
}
