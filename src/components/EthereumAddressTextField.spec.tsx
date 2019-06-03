import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import renderer from "react-test-renderer";
import appTheme from "../theme";
import EthereumAddressTextField from "./EthereumAddressTextField";
import { Web3Provider } from "./Web3Context";

describe("EthereumAddressTextField", () => {
  it("should render without Web3 being available", () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={appTheme}>
          <EthereumAddressTextField onAddress={() => undefined} />
        </ThemeProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render with meta mask icon if Web3 is available", () => {
    const fakeWindow = {
      web3: {
        currentProvider: "http://localhost:8454"
      }
    };

    const tree = renderer
      .create(
        <Web3Provider window={fakeWindow as any}>
          <ThemeProvider theme={appTheme}>
            <EthereumAddressTextField onAddress={() => undefined} />
          </ThemeProvider>
        </Web3Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
