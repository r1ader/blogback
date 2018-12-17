var express = require('express');
var axios = require('axios');
var router = express.Router();
var MD5 = require('../public/javascript/md5.js')
/* GET home page. */
router.get('/', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    var query = req.query.word || 'error'
    var appid = '20181216000249159';
    var key = 'P3EqDR5dKd5Nzkgus4BG';
    var from = 'auto';
    var to = 'auto';
    var salt = (new Date).getTime();
    var str1 = appid + query + salt + key;
    var sign = MD5(str1);
    axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
        params: {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        }
    }).then(function (response) {
        // console.log(response);
        res.send(response.data)
    }).catch(function (error) {
        // console.log(error);
        res.send(error)
    });
    // $.ajax({
    //     url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
    //     type: 'get',
    //     dataType: 'jsonp',
    //     data: {
    //         q: query,
    //         appid: appid,
    //         salt: salt,
    //         from: from,
    //         to: to,
    //         sign: sign
    //     },
    //     success: function (data) {
    //         res.send(data)
    //     }
    // });
});

module.exports = router;