const expressJwt = require('express-jwt')
const privatekey = require('./privateKey')
const cookies = require('cookies')

const authenticateHeader = expressJwt({
    secret: privatekey,
    requestProperty: 'auth',
    getToken: function(req) {
      if (!req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      }
      return null;
    }
  });

  const authenticateCookies = expressJwt({
    secret: privatekey,
    requestProperty: 'auth',
    getToken: function(req) {
      if(cookies.get('JWT')){
          return cookies.get('JWT')
      }
      return null;
    }
  });

module.exports = {
  authenticateHeader: authenticateHeader,
  authenticateCookies: authenticateCookies
}
  