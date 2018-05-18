/**
 * Created by asoadmin on 2018-05-15.
 */
var request = require("request");
var distanceCtrl = require('./distancesCtrl.js');

exports.similarity = function(data,configuration,start,end,callback){

    loadExmaples(configuration._id,configuration.clientId,start,end,function(examples){

        //console.log(examples);

        var configurations = configuration.data_descritpion;

        //check vector dimensions
        var dimensions = configurations.filter(function(config){ return config.isStatic == false });
        console.log("Total dimensions " + dimensions.length);

         var results = [];

        //iterate over data
        for(var i=0;i<data.length;i++){
            //console.log(data[i]);
            //array of similarity vectors;
            var result = [];
            //iterate over examples data
            for(var j=0;j<examples.length;j++){
                var distV = [];
                //iterate over dimensions
                for(var z=0;z<dimensions.length;z++){

                    computeSimilarity(data[i].vector[z],examples[j].vector[z],dimensions[z].type,dimensions[z].isCategorical,function(dist){
                        distV.push(dist);
                    });
                }
                //console.log(distV);
                result.push({originA:data[i],originB:examples[i],distV:distV});
            }
            //console.log(result);
             //get distance vectors
            var distVectors = result.map(function(item) {return item.distV;});
            //get similarity vector with minimal distance
            var minVector = getMinDist(distVectors,configurations);
            results.push({originV:data[i],closestV:result[minVector.index].originB,distanceV:minVector.vector});

        }
        callback(results);
    });
};


/**
 * This function computes distances between vector A and vector B
 * @param vectorA
 * @param vectorB
 * @param dataType
 * @param isCategorical
 * @returns {number} - similarity distance
 */
function computeSimilarity(vectorA,vectorB,dataType,isCategorical,callback){
    var dist = 0;
    switch (dataType){
        case 'number':
            distanceCtrl.euclideanDistance(vectorA,vectorB,function(dist){

                callback(dist);

            });
            break;
        case 'categorial':

            return 0;
            break;
        case 'string':

            if(isCategorical){
                distanceCtrl.jaccardDistance(vectorA,vectorB,function(dist){
                   callback(dist);

                });
            }
            else{
                callback(dist);
            }
            break;

        default:

            callback(dist);
            break;

    }
}


function getMinDist(simVectors,configuration){
    var dimensionIndexs = configuration.findIndex(function(config){ return config.isStatic == false });
    console.log(dimensionIndexs);

    //calculate sum(euclidean) and sum(jaccard) -> output 2d vectors [euclidean,jaccard]
    var sumVector = [];
    for (var i=0;i<simVectors.length;i++){
        var sumE = 0;var sumJ = 0;
        //iterate inside of the vector
        for(var j=0;j<simVectors[i].length;j++){
            if(configuration[dimensionIndexs[j]].dataType==='number'){
                sumE+=simVectors[i][j];
            }
            else if(configuration[dimensionIndexs[j]].dataType==='categorical'){
                sumJ+=simVectors[i][j];
            }
        }
        sumVector.push([sumE,sumJ]);
    }
    //Euclidean min value
    var len = sumVector.length, minV = Infinity,minIndex = Infinity;

    while (len--) {
        if (Number(sumVector[len][0]) < min) {
            minV = Number(sumVector[len][0]);
            minIndex = len;
        }
    }
    console.log(minV);
    return {index:minIndex,vector:simVectors[minIndex]};
}


/**
 * This function loads examples from database in specific time range,
 * if start and end not specified, then takes all examples from database
 * @param modelId
 * @param clientId
 * @param from (optional)- start timestamp
 * @param to (optional)- end timestamp
 * @param callback - array of examples
 */
function loadExmaples(modelId,clientId,start,end,callback){
    request({
        uri: "http://localhost:3002/examples",
        method: "POST",
        json: {
            modelId:modelId,
            clientId:clientId,
            from:start,
            to:end
        }

    },function(error, response, body){
        callback(body);
    });
}