var uuid = require('uuid').v4(),
    key = '',
    ig = instagram(key, uuid);

ig.login('username', 'password').then(function() {
    ig.upload('/home/void/foo.jpg').then(function(response) {
        var json = JSON.parse(response),
            media_id = json.media_id;

        ig.configure(media_id, 'Hello, World!');
    });
});