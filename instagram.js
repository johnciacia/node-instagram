var instagram = function(key, uuid) {

    var Q = require('q'),
        request = require('request'),
        fs = require('fs');

    if(!key || !uuid) {
        throw {
            name: 'TypeError',
            message: 'Key and UUID must be set'
        }
    }

    /**
     *
     */
    var getURL = function(resource, signed) {
        var protocol = signed ? 'https' : 'http';
        return protocol + '://instagram.com/api/v1/' + resource
    };

    /**
     *
     */
    var send = function(method, resource, data, signed) {
        console.log("SEND");
        var signed = typeof signed === 'undefined' || signed,
            options, 
            deferred = Q.defer();

        options = {
            url: getURL(resource, signed),
            method: method,
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Instagram 4.0.2 Android (10/3.2.2; 240dpi; 600x1024; samsung; SGH-I896; SGH-I896; smdkc210; en_GB)',
                'Accept-Language': 'en-us,en;q=0.5',
                'Accept-Charset': 'ISO-8859-1,utf-8',
                'Connection': 'keep-alive'
            },
            jar: true
        };

        if('get' !== method.toLowerCase()) {
          options.body = getSignedRequest(data)  
        } 


        var r = request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                deferred.resolve(body);
            } else {
                deferred.reject(body);
            }
        });

        if(resource == 'media/upload/') {
            var form = r.form();
            form.append('device_timestamp', data.device_timestamp);
            form.append('photo', fs.createReadStream(data.photo));
        }

        
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
            return send('post', 'accounts/login/', {
                username: username,
                password: password,
                guid: uuid,
                device_id: 'android-' + uuid
            });
        },

        suggested: function() {
            return send('get', 'friendships/suggested/');
        },

        popular: function() {
            return send('get', 'feed/popular/');
        },

        follow: function(user_id) {
            return send('post', 'friendships/create/' + user_id + '/', {
                user_id: user_id
            });
        },

        timeline: function() {
            
        },

        user_timeline: function(user_id) {
            return send('get', 'feed/user/' + user_id);
        },

        upload: function(photo) {
            return send('post', 'media/upload/', {
                'device_timestamp': Math.round(+new Date()/1000),
                'lat': '40.771019',
                'lng': '-73.955841',
                'photo': photo
            }, false)
        },

        configure: function(media_id, caption) {
           return send('post', 'media/configure/', {
                'caption': caption,
                'device_timestamp': Math.round(+new Date()/1000),
                'source_type': 4,
                'filter_type': 0,
                'media_id': media_id
            });
        }
    }
}

module.exports = {
    
}

