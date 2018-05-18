var express = require('express');
var router = express.Router();

var dataTransformerCtrl = require('../controllers/dataTransformationCtrl.js');
var similarityCtrl = require('../controllers/similarityCtrl.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*
  Feature 1
 Transforms original data to vectors
 */
/*POST transform data to vector/vectors*/
router.post('/transform',function(req,res,next){

    var data = req.body.data;
    var configuration = req.body.configuration;
    dataTransformerCtrl.transfrom(data,configuration,function(result){
         res.send(result);
    });
});


/*
 Feature 2
 Computes similarity and gets closest vector in VSM
 */
/*POST compute similarity*/
router.post('/similarity',function(req,res,next){
    var data = req.body.data;
    var configuration = req.body.configuration;
    var start = req.body.startDate;
    var end = req.body.endDate;

    similarityCtrl.similarity(data,configuration,start,end,function(result){
        res.send(result);
    })
});


module.exports = router;
