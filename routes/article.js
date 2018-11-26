var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var file = path.resolve(__dirname, `../public/article/${req.query.id}.json`); //文件路径，__dirname为当前运行js文件的目录 //
    console.log(req.query.id, '\n', file)
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send(err);
        } else {
            let result = JSON.parse(data)
            res.send(result);
        }
    });
});

module.exports = router;
