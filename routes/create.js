var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')
/* GET home page. */
router.post('/', function (req, res) {
    // console.log(req)
    res.header('Access-Control-Allow-Origin', '*');


    post = req.body
    // console.log(post.data)
    let content = post.data;
    // console.log(content)
    // var file = './' + post.title + '.json';
    let articleFilePath = path.resolve(__dirname, `../public/article/${post.title}.json`)

    fs.writeFileSync(articleFilePath, content);

    let indexFilePath = path.resolve(__dirname, `../public/article/index.json`)
    let index = JSON.parse(fs.readFileSync(indexFilePath))
    index[post.title] = JSON.parse(post.data).title
    fs.writeFileSync(indexFilePath, JSON.stringify(index, null, '\t'))
    console.log(index)
    // setTimeout(function () {
    res.send({state: 200})
    // }, 1000)
});

module.exports = router;
