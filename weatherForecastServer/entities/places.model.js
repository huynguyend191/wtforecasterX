const mongoose = require('mongoose')

let CommentSchema = mongoose.Schema({
    user: {
        type: String
    },
    email: {
        type: String,
        require: true,
    },
    rate: {
        type: Number,
    },
    commentId: {
        type: String,
    },
    content: {
        type: String
    }
})

let PlaceSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    image: {
        link: {
            type: String
        }, 
        blob: {
            type: String
        }
    },
    address: {
        longitude: {
            require: true,
            type: Number,
        },
        latitude: {
            require: true,
            type: Number,
        },
        city: {
            require: true,
            type: String,
        },
        detail: {
            require: true,
            type: String
        },
        country: {
            type: String
        }
    },
    preference: {
        minTemp: {
            type: Number
        },
        maxTemp: {
            type: Number
        },
        seasons: {
            type: Array
        },
        tag: {
            type: Array
        }
    },
    comments: {
        type: [CommentSchema]
    },
    rate: {
        type: Number,
        min: [0,'Must be a positive integer'],
        max: [5,'Must less than or equal to 5']
    },
    peopleRated: {
        type: Number
    }
})

PlaceSchema.statics.addPlace = ((data, cb) => {
    let place = {
        name: data.name,
        image: {
            link: data.link,
            blob: ''
        },
        description: data.description,
        address: {
            longitude: data.long,
            latitude: data.lat,
            city: data.city,
            detail: data.address,
            country: data.country
        },
        preference: {
            minTemp: data.minTemp,
            maxTemp: data.maxTemp,
            seasons: data.seasons,
            tag: data.tag
        },
        comments: data.comments,
        rate: data.rate,
        peopleRated: data.comments.length
    }
    return this.insert(place)
        .then(result => cb(null, result))
        .catch(err => cb(err, null))
})

module.exports = PlaceSchema;