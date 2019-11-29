var express = require('express');
var router = express.Router();
var Places = require('../common/mongoose').model('Places')
var uuidv4 = require('uuid/v4')
var axios = require('axios')

const opencageAPIkey = "e7abaf1972a949caaa6afa4358e87341"

router.get('/toAddress/:long/:lat', (req, res) => {
    let long = req.params['long']
    let lat = req.params['lat']
    let lat_lng = lat + ', ' + long
    let requestUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + lat_lng + "&key=" + opencageAPIkey
    axios.get(requestUrl)
    .then(data => {
        let response = []
        let results = data.data.results
        for(let i = 0;i<results.length;++i){
            response.push({
                'city': results[i].components.city,
                'address': results[i].formatted
            })
        }
        let remaining = data.data.rate.remaining
        res.send({
            remaining: remaining,
            results: response,
            totalresult: response.length
        })
    })
})

router.get('/', (req, res) => {
    let min_temp = req.query['min_temp']
    let max_temp = req.query['max_temp']
    let city = req.query['city']
    let tag = req.query['tag'] || ''
    let country = req.query['country']
    let season = getSeason(new Date().getMonth())
    getFavPlaces(min_temp, max_temp, season, tag, city, country, (result) => {
        res.send(result)
    })

})
router.post('/', (req, res) => {
    let data = req.body
    let place = {
        _id: uuidv4(),
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
    Places.create(place)
        .then(result => res.send(result))
        .catch(error => console.log(error))
})
router.post('/comments/:placeId/:userName/:email/:rate', (req, res) => {
    let rate = parseInt(req.params['rate'])
    if (rate < 0) res.send('Rate cannot lower than 0')
    else if (rate > 6) res.send('Rate cannot larger than 5')
    else {
        let placeId = req.params['placeId']
        let userName = req.params['userName']
        let userEmail = req.params['email']
        let comment = req.body.comment
        Places.findOne({ '_id': placeId })
            .then(result => {
                let tempResult = result.comments
                tempResult.push({
                    content: comment,
                    user: userName,
                    email: userEmail,
                    commentId: uuidv4(),
                    rate: rate
                })
                result.comments = tempResult
                result.rate = average(result.rate, result.peopleRated, rate, result.peopleRated + 1)
                console.log(result.rate)
                result.peopleRated += 1
                result.save((err, savedResult) => {
                    if (err) console.log(err)
                    res.send(savedResult)
                })
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }
})
router.delete('/remove/comment/:placeId/:commentId', (req, res) => {
    let placeId = req.params['placeId']
    console.log(placeId)
    let commentId = req.params['commentId']
    Places.findOne({ '_id': placeId })
        .then(result => {
            if (result) {
                for (let idx = 0; idx < result.comments.length; idx++) {
                    if (result.comments[idx].commentId == commentId) {
                        if(result.peopleRated-1==0){
                            result.rate = 0
                        }
                        else{
                            result.rate = average(result.rate, result.peopleRated, -1 * result.comments[idx].rate, result.peopleRated - 1)
                        }
                        result.peopleRated -= 1
                        let temp = []
                        for(let i = 0; i< result.comments.length;++i)
                            if(i != idx)
                                temp.push(result.comments[i])
                        console.log(temp)
                        result.comments = temp
                        result.save((err, savedResult) => {
                            console.log(savedResult)
                            res.send(savedResult)
                        })
                    }
                }
            }
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

router.put('/:placeId', (req, res) => {
    let new_place = req.body
    let placeId = req.params['placeId']
    Places.findOne({
        '_id': placeId
    })  
    .then(result => {
        if(result){
            result.name =  new_place.name
            result.image = {
                link: new_place.link,
                blob: ''
            }
            result.escription = new_place.description
            result.address =  {
                longitude: new_place.long,
                latitude: new_place.lat,
                city: new_place.city,
                detail: new_place.address,
                country: new_place.country
            }
            result.preference = {
                minTemp: new_place.minTemp,
                maxTemp: new_place.maxTemp,
                seasons: new_place.seasons,
                tag: new_place.tag
            }
            result.save((err, savedResult) => {
                if(err) console.log(err)
                res.send(savedResult)
            })
        }
        else {
            console.log('cannot find the place')
        }
    })
    .catch(err => {
        console.log(err)
    }) 
})

average = (curRate, curQuanity, newRateValue, newQuanity) => {
    return (curRate * curQuanity + newRateValue) / newQuanity
}
getSeason = (month) => {
    if (month >= 1 && month <= 3) {
        return 'spring'
    }
    else if (month >= 4 && month <= 8) {
        return 'summer'
    }
    else if (month >= 9 && month <= 11) {
        return 'fall'
    }
    else if (month == 12) {
        return 'winter'
    }
    else return 'error'
}
getFavPlaces = (min_temp, max_temp, season, tag, city, country, cb) => {
    let fav = []
    if(city!=null) {
        search = {
            'address.city': city,
            'address.country': country
        }
    }
    else {
        search = {
            'address.country': country
        }
    }
    Places.find(search)
        .then(results => {
            for (let index = 0; index < results.length; ++index) {
                if (results[index].preference.minTemp <= min_temp
                    && results[index].preference.maxTemp >= max_temp
                    && results[index].preference.seasons.find((ss) => ss == season) != null) {
                        if(tag=='')
                            fav.push(results[index])
                        else {
                            if(results[index].preference.tag.find((t) => t == tag) != null)
                                fav.push(results[index])
                        }
                }
            }
            cb(fav)
        })
        .catch(error => {
            console.log(error)
        })
}
module.exports = router