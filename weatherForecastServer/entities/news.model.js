const mongoose = require('mongoose')

let newsSchema = mongoose.Schema({
    begin: {
        type: String
    },
    data: {
        type: Array
    },
    total: {
        type: Number
    }
})

newsSchema.statics.cache = function (data, cb) {
    return this.findOne({
        'begin': data.begin
    }, (err, result)=>{
        if(!result) {
            this.deleteMany({}, (err, removeData)=>{
                let newData = new this({
                    begin: data.begin,
                    data: data.data,
                    total: data.total
                })
                newData.save((err, savedData) => {
                    if(err) console.log(err)
                    return cb(err, savedData)
                })
            })
        }
        else return cb(err, data)
    })
}
module.exports = newsSchema