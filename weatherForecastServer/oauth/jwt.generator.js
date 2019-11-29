const jwt = require('jsonwebtoken')
// const Cookies = require('cookies')

const privateKey = "MIICXAIBAAKBgQCA6ykvEJC/lCq5MHlzauUqTy/xXTE5Hnw0DhpfLZkOCYsqCTVKiVx/OJIbUNRFZIMIgZSzUQ1u/Ib+PV2Icf2SQ/Y0hz/nwxOHuXp0NWij8sc/ZtYXt8CpVqvvlfLiROd0/uRpm9oQG/QczULy3C2z6+bS0Av62wkqOqbdlZEKHwIDAQABAoGAZ9gE5opbblY1S9LGIbg7PCdpIOzGV5I8zdmGWKBsJyh81rFwIcgfn8K7vhEPy425FsL6Oq7ROVNkkapwixX3ABPaDPm/madpwEdr+H3voV1slHksuwFEqhhW4EayDAviK4PJ7l6wU3fnK+4hm8BR0RVyvvgcEgIhVqfpHtMz5AECQQC3sDddFR48j9hjcCM5h2rZ0gKd4ppluCQGTisGKRRIlrJ3l0WidayghpOOlnp6mQGfXlY/5C065RJAqpyDE/8fAkEAs6tY3i8TtOqXOpdqPXPrvpC6rTnh8hCws5cOQVo8VErTvn1/fTcGyh7yjs63oKAMBrPbjI/XfP7lGacusQCVAQJAEL/ozHwYfb1AJhEbpStL+wDDbFI1cgEQh+Ko2a71Qok7TNxmZSIF071xxxbBpFw/YaDgjILp/OzWdT8ZdnpkUQJBAJYAORqOXTqPHKEbJuSVcj1QYbob+Cp7irr1Iz6mknWhXzTLW/PzS+TVf5aAuUgONtwlruekc7j0qdsH+/Bk1wECQA3crE26oun2QNMUgdeoTsNyeFMAWE/QC6scpEXtZFwOt0H9kvwAooJd8ybDAdxCLDOhU3/h9vT45tODK8Ur8LE="

var createToken = function(auth) {
    return jwt.sign({
      id: auth.id,
      userInfor: auth.userInfor,
      role: auth.role
    }, privateKey,
    {
      expiresIn: 60 * 120
    });
  };
  
var generateToken = function (req, res, next) {
req.token = createToken(req.auth);
console.log(req.token)
next();
};

var sendToken = function (req, res) {
// let cookies = new Cookies(req, res)
res.header('x-auth-token', req.token);
res.header("Access-Control-Allow-Origin", "*");
// cookies.set("JWT", req.token, {maxAge: '2678400000'})
res.status(200).send(req.auth);

};

var saveTokenCookies = function (req, res, value) {
cookies.set("JWT", value, {maxAge: '2678400000'})
}

module.exports = {
    createToken: createToken,
    generateToken: generateToken,
    sendToken: sendToken,
    saveTokenCookies: saveTokenCookies
}