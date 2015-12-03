# needle-retries

Based on [needle](https://www.npmjs.org/package/needle) and [retry](https://www.npmjs.org/package/retry), it allows to retry a fail attempt.

## Installation
```
npm install needle-retries
```

## Getting started
Needle is a dependency of needle-retries so that by using this module, this should still work with the latest version of Needle.

```javascript
var _needle = require('needle');
var needle = require('needle-retries')(_needle);

needle.get('http://stackoverflow.com/feeds', {needleRetry: {retries: 1, maxTimeout: 30*1000}}, function(err, response) {
    console.log('response', response.body);
});
```

It's working with Promises too:
```javascript
var _needle = require('needle');
var Promise = require('bluebird');
var needle = Promise.promisifyAll( require('needle-retries')(_needle) );

needle.requestAsync('get', 'http://stackoverflow.com/feeds', {needleRetry: {retries: 3}}).then(function(response) {
    console.log('response', response.body);
}).catch(e => console.error('error', e));
```


Have a look at the respective doc pages for [needle](https://www.npmjs.org/package/needle) and [retry](https://www.npmjs.org/package/retry) for a list of available options.

## Limitations
It's not working with Streams, Pipes, ... and might never work. While a stream starts to send data at the beginning, a stream may fail also at any time, so that when it fails a full new request should be restarted. Obviously, this is not possible with this module.

Therefore, for Streams and Pipes, please use directly Needle (in the example above, you can access Needle through `_needle`).
