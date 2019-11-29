var express = require('express');
var router = express.Router();
const User = require('../common/mongoose').model('UserInfor')
const jwt = require('../oauth/jwt.generator')
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/login/:role', function(req, res){
  let data = req.body
  let role = req.params['role']
  User.findOne({
    'idToken': data.idToken,
  },(err, result) =>{
    if(err) console.log(err)
    if(!result){
      User.findOrCreateUser(data, (err, signInUser)=>{
        if(err) console.log(err)
        req.auth = {
          role: role,
          userInfor: signInUser,
          id: signInUser.idToken
        }
        jwt.generateToken(req, res)
        jwt.sendToken(req, res)
      })
    }
    else {
      req.auth = {
        role: role,
        userInfor: result,
        id: result.idToken
      }
      jwt.generateToken(req, res)
      jwt.sendToken(req, res)
    }
  })
})
module.exports = router;
