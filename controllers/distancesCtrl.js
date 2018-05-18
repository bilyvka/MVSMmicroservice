/**
 * Created by asoadmin on 2018-05-15.
 * This controller computes:
 *  - jaccard distance
 *  - euclidean distance
 *  - cosine similarity
 */
var jaccard = require('jaccard');
var euclideanDistance = require('euclidean-distance');
var cosineSimilarity = require( 'compute-cosine-similarity' );

exports.jaccardDistance = function(vectorA,vectorB,callback){

    if(!(vectorA instanceof Array)){
        var temp = [];
        temp.push(vectorA);
        vectorA = temp;
    }
    if(!(vectorB instanceof Array)){
        var temp = [];
        temp.push(vectorB);
        vectorB = temp;
    }

     callback(jaccard.distance(vectorA,vectorB));
};

exports.euclideanDistance = function (vectorA,vectorB,callback) {
    if(!(vectorA instanceof Array)){
        var temp = [];
        temp.push(vectorA);
        vectorA = temp;
    }
    if(!(vectorB instanceof Array)){
        var temp = [];
        temp.push(vectorB);
        vectorB = temp;
    }

    callback(euclideanDistance(vectorA,vectorB));
};

exports.cosineDistance = function (vectorA,vectorB,callback) {
    callback(cosineSimilarity.similarity(vectorA,vectorB));
};
