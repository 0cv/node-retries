var retry = require('retry');

module.exports = function(needle) {
    function retryReq(type, args) {
        //object to array
        args = [...args];

        //cb is the cb from the main call.
        var cb;
        var opts;

        //only if it's a function
        if(typeof args[args.length-1] === 'function') cb = args.pop();

        //trying to find where the options are located.
        switch(type) {
            case 'get':
            case 'head':
                opts = args.length===2 && args[1] || {};
                break;
            case 'patch':
            case 'post':
            case 'put':
            case 'delete':
                opts = args.length===3 && args[2] || {};
                break;
            default:
                opts = {};
        }
        //in case we have just the uri, we set an empty object representing data
        //which is the 3rd parameter of needle.request
        if(args.length === 1) args.push({});

        //opts.needleRetry is where the options for 'retry' are stored
        //have a look at https://github.com/tim-kos/node-retry for all available
        //options (e.g. retries, factor, minTimeout, maxTimeout, randomize, ...)
        var operation = retry.operation(opts.needleRetry || {
            minTimeout: 2 * 1000,
            maxTimeout: 30 * 1000
        });

        operation.attempt(function() {
            //request is done through the generic needle.request method.
            //method, uri, opts, callback
            needle.request(type, ...args, function(err) {
                //will redo whenever needle throws an error.
                if (operation.retry(err)) {
                    return;
                }

                cb && cb(...arguments);
            });
        });
    }
    //we copy the properties from Needle, for everything either not implemented,
    //or not going to be implemented (e.g. needle.defaults)
    var needleRetry = {}; 
    needleRetry.delete = function() {
        return retryReq('delete', arguments);
    }
    needleRetry.get = function() {
        return retryReq('get', arguments);
    }
    needleRetry.head = function() {
        return retryReq('head', arguments);
    }
    needleRetry.patch = function() {
        return retryReq('patch', arguments);
    }
    needleRetry.post = function() {
        return retryReq('post', arguments);
    }
    needleRetry.put = function() {
        return retryReq('put', arguments);
    }
    needleRetry.request = function() {
        arguments = [...arguments];
        return retryReq(arguments.shift(), arguments);
    }
    needleRetry.defaults = function() {
        return needle.defaults(...arguments);
    }
    return needleRetry;
}
