import { SettingsStore } from "../settingsStore";
import { DefaultComitNodeApiConfig } from "./config";

class FakeSettingsStore implements SettingsStore {
  public getHost(): string {
    return "example.com";
  }

  public getPort(): number {
    return 1234;
  }

  // @ts-ignore
  public setHost(host: string) {
    return undefined;
  }

  // @ts-ignore
  public setPort(port: number): void {
    return undefined;
  }
}

describe("Comit Node API config", () => {
  it("should return true if injected function is available", () => {
    const fakeWindow: any = {
      getComitNodeApiEndpoint: () => ({
        port: 8080,
        host: "localhost"
      })
    };

    const config = new DefaultComitNodeApiConfig(fakeWindow, {} as any);

    expect(config.isOverrideActive()).toBeTruthy();
  });

  it("should return false if injected function is not available", () => {
    const fakeWindow: any = {};

    const config = new DefaultComitNodeApiConfig(fakeWindow, {} as any);

    expect(config.isOverrideActive()).toBeFalsy();
  });

  it("should return value from storage if override not active", () => {
    const fakeWindow: any = {};

    const config = new DefaultComitNodeApiConfig(
      fakeWindow,
      new FakeSettingsStore()
    );

    expect(config.getEffectivePort()).toBe(1234);
    expect(config.getEffectiveHost()).toBe("example.com");
  });
});
