import { storiesOf } from '@storybook/react';
import React from 'react';
import Web3AddressLoaderButton from "../src/components/Web3AddressLoaderButton"

storiesOf('Web3AddressLoaderButton', module)
  .add('with text', () => (
    <Web3AddressLoaderButton/>
  ))
  ;
