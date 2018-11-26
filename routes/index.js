var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')
/* GET home page. */
router.get('/', function (req, res, next) {
    var file = path.resolve(__dirname, '../public/article/2018-11-19T18:41:18+08:00.json'); //文件路径，__dirname为当前运行js文件的目录 //
    console.log(file)
    // var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径 //读取json文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(JSON.parse(data));
        }
    });
    // let id = req.query.id
    // console.log(id)
    // res.send({res: 'new thindg', parme: id});
});

module.exports = router;
