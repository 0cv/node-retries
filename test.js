var _needle = require('needle');
var Promise = require('bluebird');
var needle = Promise.promisifyAll( require('needle-retries')(_needle) );

needle.requestAsync('get', 'https://raw.github123usercontent.com/tomas/needle/master/pack2age.json', {needleRetry: {retries: 5}}).then(function(response) {
	console.log('final body', response.body);
}).catch(e => console.error('final error', e));
