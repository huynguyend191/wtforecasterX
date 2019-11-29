const mongoose = require('mongoose')

let dailyForecast = mongoose.Schema({
    begin: {
        type: String,
    },
    unit: {
        type: String,
    },
    location: {
        lat: {
            type: Number,
        },
        long: {
            type: Number
        }
    },
    weatherInfor: {
        timezone: {
            type: String,
        },
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
        },
        dailySummary: {
            type: String
        },
        dailyIcon: {
            type: String
        },
        dailyForecast: {
            type: Array
        }
    }
})
dailyForecast.statics.cache = function (data, cb) {
    return this.deleteMany({
        'location.lat': data.location.lat,
        'location.long': data.location.long,
        'unit': data.unit
    }, (err, result) => {
        if (err) console.log(err)
        let newData = new this({
            begin: data.begin,
            unit: data.unit,
            location: data.location,
            weatherInfor: data.weatherInfor
        })
        newData.save((err, savedData) => {
            if (err) console.log(err)
            return cb(err, savedData)
        })
    })
}

module.exports = dailyForecast