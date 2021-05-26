## Website v1 ##
This website includes an `.htaccess` file (apache configuration file) but can be used on other servers.

### Getting started ###
Scripts must be compiled from source. Both scripts and styles are supposed to be minified (to .min.js and .min.css files) using [terser](https://www.npmjs.com/package/terser) and [clean-css](https://www.npmjs.com/package/clean-css) but you can rename the .js and .css files to match the urls used in `index.html`.

In order to build the scripts you must install typescript (example using [nodejs](https://nodejs.org/))
```shell
npm i -g typescript
```
Then run this following line in the project folder (use `cd` if needed)
```shell
tsc index.ts
```