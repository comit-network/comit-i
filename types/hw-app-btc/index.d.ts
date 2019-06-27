declare module "hw-app-btc" {
  const DEFAULT_VERSION = 1;
  const DEFAULT_LOCKTIME = 0;
  const SIGHASH_ALL = 1;

  class Btc {
    constructor(transport: Transport<any>, scrambleKey: string = "BTC");

    transport: Transport<any>;
    hashPublicKey(buffer: Buffer): any;
    getWalletPublicKey_private(
      path: string,
      verify: boolean,
      segwit: boolean
    ): Promise<{
      publicKey: string;
      bitcoinAddress: string;
      chainCode: string;
    }>;
    public getWalletPublicKey(
      path: string,
      verify?: boolean = false,
      segwit?: boolean = false
    ): Promise<{
      publicKey: string;
      bitcoinAddress: string;
      chainCode: string;
    }>;
    getTrustedInputRaw(
      transactionData: Buffer,
      indexLookup: number | null | void
    ): Promise<string>;
    getTrustedInput(
      indexLookup: number,
      transaction: Transaction
    ): Promise<string>;
    async getTrustedInputBIP143(indexLookup: number, transaction: Transaction);
    getVarint(data: Buffer, offset: number): [number, number];
    startUntrustedHashTransactionInputRaw(
      newTransaction: boolean,
      firstRound: boolean,
      transactionData: Buffer,
      bip143?: boolean = false,
      overwinter?: boolean = false
    );
    startUntrustedHashTransactionInput(
      newTransaction: boolean,
      transaction: Transaction,
      inputs: Array<{ trustedInput: boolean; value: Buffer }>,
      bip143?: boolean = false,
      overwinter?: boolean = false
    );
    provideOutputFullChangePath(path: string): Promise<string>;
    hashOutputFull(outputScript: Buffer): Promise<any>;
    signTransaction(
      path: string,
      lockTime?: number = DEFAULT_LOCKTIME,
      sigHashType?: number = SIGHASH_ALL,
      expiryHeight?: Buffer
    ): Promise<Buffer>;
    signMessageNew(
      path: string,
      messageHex: string
    ): Promise<{ v: number; r: string; s: string }>;
    createPaymentTransactionNew(
      inputs: Array<
        [Transaction, number, string | null | void, number | null | void]
      >,
      associatedKeysets: string[],
      changePath?: string,
      outputScriptHex: string,
      lockTime?: number = DEFAULT_LOCKTIME,
      sigHashType?: number = SIGHASH_ALL,
      segwit?: boolean = false,
      initialTimestamp?: number,
      additionals?: Array<string>,
      expiryHeight?: Buffer
    );
    signP2SHTransaction(
      inputs: Array<
        [Transaction, number, string | null | void, number | null | void]
      >,
      associatedKeysets: string[],
      outputScriptHex: string,
      lockTime?: number = DEFAULT_LOCKTIME,
      sigHashType?: number = SIGHASH_ALL,
      segwit?: boolean = false,
      transactionVersion?: number = DEFAULT_VERSION
    );
    compressPublicKey(publicKey: Buffer): Buffer;
    createVarint(value: number): Buffer;
    splitTransaction(
      transactionHex: string,
      isSegwitSupported: boolean | null | void = false,
      hasTimestamp?: boolean = false,
      hasExtraData?: boolean = false
    ): Transaction;
    serializeTransactionOutputs({ outputs }: Transaction): Buffer;
    serializeTransaction(
      transaction: Transaction,
      skipWitness: boolean,
      timestamp?: Buffer
    );
    displayTransactionDebug(transaction: Transaction);
  }

  export = Btc;
}
