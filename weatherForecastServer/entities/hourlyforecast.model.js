const mongoose = require('mongoose')

let hourlyForecast = mongoose.Schema({
    begin: {
        type: String
    },
    unit: {
        type: String
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
            type: String
        },
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
        },
        hourlySummary: {
            type: String
        },
        hourlyIcon: {
            type: String
        },
        hourlyForecast: {
            type: Array
        }
    }
})

hourlyForecast.statics.cache = function (data, cb) {

    return this.deleteMany({
        'location.long': data.location.long,
        'location.lat': data.location.lat,
        'unit': data.unit
    }, (err, document) => {
        if (err) console.log('error\n' + document)
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

module.exports = hourlyForecast