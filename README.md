# COMIT-i

A WebGUI for comit-rs.

## User behavior

COMIT-i is currently under heavy development and in order to learn from our user behavior about what we need to optimize we make use of Google Analytics.

In order to include the Google Analytics tag and the Google Tag Manager tag in the release bundle, create a 
`.env.production` file with the following content:
```bash
REACT_APP_GTM_TAG="GTM-XXXXXXX"
REACT_APP_GA_TAG="UA-XXXXXXXXX-X"
```  

## License

comit-i source code is completely free and released under the [MIT License](./LICENSE.md)
