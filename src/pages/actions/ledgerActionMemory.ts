export interface LedgerActionMemory {
  rememberActionExecution(
    actionName: string,
    swapId: string,
    transactionId?: string
  ): void;
  wasActionAlreadyExecuted(actionName: string, swapId: string): boolean;
  getTransactionId(actionName: string, swapId: string): string | null;
}

export class LocalStorageLedgerActionMemory implements LedgerActionMemory {
  private localStorage: Storage;

  constructor(localStorage: Storage) {
    this.localStorage = localStorage;
  }

  public rememberActionExecution = (
    actionName: string,
    swapId: string,
    transactionId?: string
  ) => {
    const key = this.generateKey(swapId, actionName);

    this.localStorage.setItem(key, transactionId || "noTransactionId");
  };

  public wasActionAlreadyExecuted = (actionName: string, swapId: string) => {
    const key = this.generateKey(swapId, actionName);

    return !!this.localStorage.getItem(key);
  };

  public getTransactionId = (actionName: string, swapId: string) => {
    const key = this.generateKey(swapId, actionName);

    return this.localStorage.getItem(key);
  };

  private generateKey = (swapId: string, actionName: string) => {
    // There must be a better approach than this
    return swapId + actionName;
  };
}

export default new LocalStorageLedgerActionMemory(window.localStorage);
