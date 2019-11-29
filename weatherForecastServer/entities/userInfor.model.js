const mongoose = require('mongoose')

let UserInfor = mongoose.Schema({
    idToken: {
        type: String,
        require: true,
        trim: true,
    },
    acessToken: {
        type: String,
        trim: true
    },
    user:{
        email: {
            type: String,
            require: true,
            trim: true,
        },
        id: {
            type: String,
            require: true,
            trim: true,
        },
        givenName: {
            type: String, 
        },
        familyName: {
            type: String, 
        },
        photo: {
            type: String,
        },
        name: {
            type: String, 
        },
    },
})
UserInfor.statics.findOrCreateUser = (user, cb) => {
    return this.findOne({
        'idToken': user.idToken
    }, (err, user) => {
        if(!user) {
            var newUser = new that({
                idToken: user.idToken,
                accessToken: user.accessToken,
                user: {
                    id: user.user.id,
                    email: user.user.email,
                    givenName: user.user.givenName || 'None',
                    familyName: user.user.familyName || 'None',
                    photo: user.user.photo || 'None',
                    name: user.user.name || 'None'
                }
            })
            newUser.save((err, savedUser) => {
                if (err) console.log(err)
                return cb(err, savedUser)
            })
        }
        else return cb(err, user)
    })
}

module.exports = UserInfor