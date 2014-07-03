var instagram = function(key, uuid) {

    var Q = require('q'),
        request = require('request'),
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
    var foo = function(method, resource, data, signed) {
        var signed = typeof signed === 'undefined' || signed,
            protocol = signed ? 'https' : 'http',
            port = signed ? 443 : 80,
            options, 
            req,
            deferred = Q.defer();

        options = {
            url: protocol + '://instagram.com/api/v1/' + resource,
            method: method,
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Instagram 4.0.2 Android (10/3.2.2; 240dpi; 600x1024; samsung; SGH-I896; SGH-I896; smdkc210; en_GB)',
                'Accept-Language': 'en-us,en;q=0.5',
                'Accept-Charset': 'ISO-8859-1,utf-8',
                'Connection': 'keep-alive'
            },
            body: 'get' === method.toLowerCase() || getSignedRequest(data)
        };

        req = request(options, function(error, response, body) {
            console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info);
            }
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
            return foo('post', 'accounts/login/', {
              username: username,
              password: password,
              guid: uuid,
              device_id: 'android-' + uuid
            });
        },

        suggested: function() {
            return foo('get', 'friendships/suggested/');
        },

        popular: function() {
            return foo('get', 'feed/popular/');
        },

        follow: function(user_id) {
          return foo('post', 'friendships/create/' + user_id + '/', {
            user_id: user_id
          });
        },

        configure: function(media_id, caption) {
           return foo('post', 'media/configure/', {
                'geotag_enabled': false,
                'caption': caption,
                'device_timestamp': Math.round(+new Date()/1000),
                'source_type': 4,
                'filter_type': 0,
                'media_id': media_id
          });
        }
    }
}