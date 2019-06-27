declare module "hw-transport-u2f" {
  class Transport<any> {
    static create(
      openTimeout?: number = 3000,
      listenTimeout?: number = 10000
    ): Promise<Transport<Descriptor>>;
  }

  class TransportU2F extends Transport<null> {
    constructor();

    static create(
      openTimeout?: number = 3000,
      listenTimeout?: number = 10000
    ): Promise<Transport<Descriptor>>;

    static isSupported(): boolean;
    static list(): any;
    static listen(observer: any);
    scrambleKey: Buffer;
    open(_: any, _openTimeout?: number = 5000): Promise<TransportU2F>;
    async exchange(apdu: Buffer): Promise<Buffer>;
    setScrambleKey(scrambleKey: string);
    close(): Promise<void>;
  }

  export = TransportU2F;
}
