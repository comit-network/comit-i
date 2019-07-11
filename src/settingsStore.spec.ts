import { LocalStorageSettingsStore } from "./settingsStore";

class LocalStorageStub implements Storage {
  // @ts-ignore
  public readonly length: number;

  public clear = () => {
    return undefined;
  };

  // @ts-ignore
  public getItem(key: string): string | null {
    return null;
  }

  // @ts-ignore
  public key(index: number): string | null {
    return null;
  }

  // @ts-ignore
  public removeItem = (key: string) => {
    return undefined;
  };

  // @ts-ignore
  public setItem = (key: string, value: string) => {
    return undefined;
  };
}

describe("SettingsStore", () => {
  it("should fall back to localhost if host is not stored", () => {
    const settingsStore = new LocalStorageSettingsStore(new LocalStorageStub());

    const host = settingsStore.getHost();

    expect(host).toBe("localhost");
  });

  it("should fall back to 8000 if port is not stored", () => {
    const settingsStore = new LocalStorageSettingsStore(new LocalStorageStub());

    const host = settingsStore.getPort();

    expect(host).toBe(8000);
  });
});
