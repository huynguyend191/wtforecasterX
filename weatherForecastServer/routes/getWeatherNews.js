const express = require('express')
const jsdom = require('jsdom')
const axios = require('axios')

const router = express.Router()
const URL = 'https://vov.vn/du-bao-thoi-tiet/tags-ZOG7sSBiw6FvIHRo4budaSB0aeG6v3Q=.vov'
const news = require('../common/mongoose').model('News')
const { JSDOM } = jsdom

router.get('/forecast', (req, res)=>{
    let page = req.query['page']
    console.log(page)
    let respone_data = {
        total: 0,
        data: []
    }
    let count = 0
    for(let p = 1;p<=page;++p){
        let request_url = URL + '?page=' + p
        if(p==1) request_url = URL
        let result_page = {
            begin: new Date().toDateString(),
            page: p,
            err: [],
            data: [],
            count: 0
        }
        axios.get(request_url)
            .then(data => {
                let html_string = data.data
                let window = (new JSDOM(html_string)).window
                let tag_result_div = window.document.getElementsByClassName('stories-style-6')[0]
                let article_stories = tag_result_div.getElementsByClassName('story')
                for(let index = 0;index < article_stories.length;++index){
                    let title = article_stories[index].getElementsByTagName('a')[1].text
                    let link = article_stories[index].getElementsByTagName('a')[1].getAttribute('href')
                    let img = article_stories[index].getElementsByTagName('img')[0].getAttribute('src')
                    let description = article_stories[index].getElementsByClassName('story__desc')[0].textContent
                    result_page.data.push({
                        title: title,
                        link: 'https://vov.vn' + link,
                        thumbnail: img,
                        thumbnail_alt: title,
                        summary: description
                    })
                }
                count += 1
                result_page.count = result_page.data.length
                //console.log(result_page)
                respone_data.data.push(result_page)
                if(count == page){
                    let total = 0
                    respone_data.data.forEach(d => {
                        total += d.count
                    })
                    respone_data.total = total
                    res.send(respone_data)
                }
            })
            .catch(err => {
                if(err) console.log(err)
                result_page.err.push(err)
            })
        
    }
    
})

router.get('/cache/forecast', (req, res)=>{
    let page = req.query['page']
    console.log(page)
    news.findOne({'begin': new Date().toDateString(), 'total': page*20}, (err, result)=>{
        if(err) console.log(err)
        if(!result){
            let respone_data = {
                begin: new Date().toDateString(),
                total: 0,
                data: []
            }
            let count = 0
            for(let p = 1;p<=page;++p){
                let request_url = URL + '?page=' + p
                if(p==1) request_url = URL
                let result_page = {
                    page: p,
                    err: [],
                    data: [],
                    count: 0
                }
                axios.get(request_url)
                    .then(data => {
                        let html_string = data.data
                        let window = (new JSDOM(html_string)).window
                        let tag_result_div = window.document.getElementsByClassName('stories-style-6')[0]
                        let article_stories = tag_result_div.getElementsByClassName('story')
                        for(let index = 0;index < article_stories.length;++index){
                            let title = article_stories[index].getElementsByTagName('a')[1].text
                            let link = article_stories[index].getElementsByTagName('a')[1].getAttribute('href')
                            let img = article_stories[index].getElementsByTagName('img')[0].getAttribute('src')
                            let description = article_stories[index].getElementsByClassName('story__desc')[0].textContent
                            result_page.data.push({
                                title: title,
                                link: 'https://vov.vn' + link,
                                thumbnail: img,
                                thumbnail_alt: title,
                                summary: description
                            })
                        }
                        count += 1
                        result_page.count = result_page.data.length
                        //console.log(result_page)
                        respone_data.data.push(result_page)
                        if(count == page){
                            let total = 0
                            respone_data.data.forEach(d => {
                                total += d.count
                            })
                            respone_data.total = total
                            news.cache(respone_data,(err, data)=>{
                                if(err) console.log(err)
                                res.send(data)
                            })
                        }
                    })
                    .catch(err => {
                        if(err) console.log(err)
                        result_page.err.push(err)
                    })
                
            }
        }
        else res.send(result)
    })
    
    
    
})

module.exports = router