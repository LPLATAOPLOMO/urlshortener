const express = require('express')
const router = express.Router();
const validUrl = require('valid-url')
const shortid = require('shortid')
const config = require('config')

const Url = require('../models/Url')

// Post Request   api/url/shorten
// desc  Create short url

router.post('/shorten', async (req,res) => {
    const longUrl = req.body.lurl;
    console.log(req.body);
    const baseUrl = config.get('baseURL');
    console.log(baseUrl);
    // check base url
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base url');
    }

    // Create url code 
    const urlCode = shortid.generate();

    // check long url
    if(longUrl==""){
        res.render("index",{
            message : "Please Provide url",
            urlvalue: ""
        })
    }
    else if(!validUrl.isUri(longUrl)){
        res.render("index",{
            message : "Invalid url",
            urlvalue: ""
        })
    }else{
        try {
           let url = await Url.findOne({longUrl});
           
           if(url){
            res.render("index",{
                message:"",
                urlvalue : url.shortUrl
            });
           }else{
               const shortUrl = baseUrl + '/' + urlCode;

               url = new Url({
                   longUrl,
                   shortUrl,
                   urlCode,
                   date: new Date()
               });
               await url.save()
               res.render("index",{
                    message:"",
                    urlvalue : url.shortUrl
                })
           }
        } catch (error) {
            console.log(error);
            res.status(500).json('Server Error')
        }
    }
})
module.exports = router;