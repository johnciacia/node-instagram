var Instagram = {
  

  signature: function(msg) {
    var crypto = require('crypto');
    return crypto.createHmac('SHA256', this.key).update(msg).digest('hex');
  }

}