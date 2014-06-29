var instagram = function(key, uuid) {

    var Q = require('q'),
        responseBody = '',
        cookies = [];

    if(!key || !uuid) {
        throw {
            name: 'TypeError',
            message: 'Key and UUID must be set'
        }
    }

    /**
     *
     */
    var request = function(method, resource, data, signed) {
        var signed = typeof signed === 'undefined' || signed,
            transport = signed ? require('https') : require('http'),
            port = signed ? 443 : 80,
            options, 
            req,
            deferred = Q.defer();

        options = {
            hostname: 'instagram.com',
            port: port,
            path: '/api/v1/' + resource,
            method: method,
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Instagram 4.0.2 Android (10/3.2.2; 240dpi; 600x1024; samsung; SGH-I896; SGH-I896; smdkc210; en_GB)',
                'Accept-Language': 'en-us,en;q=0.5',
                'Accept-Charset': 'ISO-8859-1,utf-8',
                'Connection': 'keep-alive',
                'Cookie': cookies.join(', ')
            }
        };

        req = transport.request(options, function(res) {
            var responseBody = '';
            res.setEncoding('utf8');
            cookies = res.headers['set-cookie'];
            
            res.on('data', function(chunk) {
                responseBody += chunk;
            });

            res.on('end', function() {
                console.log(responseBody);
                deferred.resolve(responseBody);
            });
        });

        'get' === method.toLowerCase() || req.write(getSignedRequest(data));
        req.end();

        req.on('error', function(e) {
            deferred.reject(e.message)
        });

        return deferred.promise
    };

    /**
     *
     */
    var getSignedRequest = function(data) {
        var data = JSON.stringify(data),
            post = {
                'ig_sig_key_version': '4',
                'signed_body': getSignature(data) + '.' + data
            };

        return require('querystring').stringify(post);
    };

    /**
     *
     */
    var getSignature = function(msg) {
        return require('crypto').createHmac('SHA256', key).update(msg).digest('hex');
    };


    return {
        login: function(username, password) {
            return request('post', 'accounts/login/', {
                username: username,
                password: password,
                guid: uuid,
                device_id: 'android-' + uuid
            });
        },

        suggested: function() {
            return request('get', 'friendships/suggested/');
        },

        popular: function() {
            return request('get', 'feed/popular/');
        } 
    }
}

var key = '',
    uuid = '',
    ig = instagram(key, uuid);

ig.login('', '').then(function() {
    ig.popular();
});

