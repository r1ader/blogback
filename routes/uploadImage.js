var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')
const querystring = require('querystring');
let uuid = () => {  //生成uuid方法
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

router.post('/', (req, res, next) => {  //post请求  我这边用的是express router 
    res.header('Access-Control-Allow-Origin', '*');
    req.setEncoding('binary');
    let body = '';   // 文件数据
    // 边界字符串
    let boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');

    //接收post如data 流 buffer
    req.on('data', function (d) {
        body += d;
    });

    req.on('end', function () {
        let file = querystring.parse(body, '\r\n', ':');
        let fileInfo = file['Content-Disposition'].split('; ');
        let fileName = '';
        let ext = '';
        for (let value in fileInfo) {
            if (fileInfo[value].indexOf("filename=") != -1) {
                fileName = fileInfo[value].substring(10, fileInfo[value].length - 1);

                if (fileName.indexOf('\\') != -1) {
                    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
                }
                ext = fileName.substr(fileName.indexOf('.') + 1, fileName.length);
            }
        }

        let upperBoundary = body.toString().indexOf(file['Content-Type'].substring(1)) + file['Content-Type'].substring(1).length;

        let binaryDataAlmost = body.toString().substring(upperBoundary).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

         // 上传文件重命名
        let uuidFileName = `${uuid()}.${ext}` 
        //上传文件 本地存放地址
        // let uploadDirFile = `./${uuidFileName}` 
        let uploadDirFile = path.resolve(__dirname, `../public/file/${uuidFileName}`)
        //创建文件流
        let writerStream = fs.createWriteStream(uploadDirFile);

        //开始 —— 写入文件到本地
        writerStream.write(binaryDataAlmost.substring(0, binaryDataAlmost.indexOf(`--${boundary}--`)), 'binary'); 
        //写入完成
        writerStream.end();
        writerStream.on('finish', function () {
            console.log("写入完成。");
            //删除刚刚创建好的本地文件 -> 只有在把文件存起来的时候需要删除掉本地，否则不要用。
            // fs.unlinkSync(uploadDirFile) 
            res.send({ data: uuidFileName, code: 0, msg: 'ok' })
        });
    });
})

module.exports = router;
