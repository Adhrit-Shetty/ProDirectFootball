/**
 * Created by vn_shetty on 29/4/17.
 */
var express = require('express');
var router = express.Router();
var Wall = require('../models/wallpaper');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

// router.get('/',function(request,response){
//     var link="../public/html/addWallpaper.html";
//     link = path.join(__dirname,link);
//     console.log(link+"-"+fs.existsSync(link));
//     var stream=fs.createReadStream(link);
//     stream.pipe(response);
// });

router.get('/',function(request,response){
    console.log('hererererQq!');
    Wall.find({},function(err,data){
        if(err){
            response.json(err);
            console.log('here!!');
        }
        else {
            var s = _.countBy(data, function (num) {
                return 'count';
            });
            console.log(s.count);
            var x = Math.ceil(Math.random() * s.count);
            console.log(x-1);
            response.json(data[x-1].image[0].data);
        }
    });

});
router.post('/add',function(request,response){
    console.log(request.body);
    console.log(request.files);
    Wall.create({},function(err,data){
        var j ={name:request.body.name,"data":request.body.data};
        data.image.push(j);
        data.save(function(err,result){
            if(err)
                response.json(err);
            else
                response.json(result);
        });
    });
});
module.exports = router;
