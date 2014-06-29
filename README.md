```
var uuid = require('uuid').v4(),
    key = '------------------------------',
    ig = instagram(key, uuid);

ig.login('username', 'password').then(function() {
    ig.popular().then(function(response) {
      console.log(response);
    });
});
```