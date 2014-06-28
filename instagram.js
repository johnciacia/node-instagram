var Instagram = {
  
  call: function(data) {
    var https = require('https');
    var options = {
      hostname: 'instagram.com',
      port: 443,
      path: '/api/v1/accounts/login/',
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Instagram 4.0.2 Android (10/3.2.2; 240dpi; 600x1024; samsung; SGH-I896; SGH-I896; smdkc210; en_GB)',
        'Accept-Language': 'en-us,en;q=0.5',
        'Accept-Charset': 'ISO-8859-1,utf-8',
        'Connection': 'keep-alive',
      }
    };


    var req = https.request(options, function(res) {
      res.on('data', function(d) {
        process.stdout.write(d);
      });
    });

    req.write(this.signed_request(data));
    req.end();

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });


  },

  signed_request: function(data) {
    var querystring = require("querystring");
    var data = JSON.stringify(data);

    var post = {
      'ig_sig_key_version': '4',
      'signed_body': this.signature(data) + '.' + data
    }
    return querystring.stringify(post);
  },

  signature: function(msg) {
    return require('crypto').createHmac('SHA256', this.key).update(msg).digest('hex');
  },

  login: function(username, password) {
    this.call({
      username: username,
      password: password,
      guid: this.uuid,
      device_id: 'android-' + this.uuid
    });
  }

} 

Instagram.key = '';
Instagram.uuid = '';
Instagram.login('username', 'password');

