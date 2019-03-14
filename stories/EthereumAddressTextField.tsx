import { storiesOf } from '@storybook/react';
import React from 'react';
import EthereumAddressTextField from "../src/components/EthereumAddressTextField";

storiesOf('EthereumAddressTextField', module)
  .add('default', () => (
    <EthereumAddressTextField/>
  ))
;
