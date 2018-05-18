
/**
 * Created by asoadmin on 2018-05-07.
 * This controller responsible for data transformation from origin to multidimensional vector
 */

var natural = require('natural');
var stopword = require('stopword');


/**
 *Transform function transform original data to multidimensional vector
 * Rules:
 *   - if data type string and not categorical, not array, the it is -> text, then apply word2Vector approach
 *   - if data is categorical and type string -> apply binary encoding
 *   - if data type is number and not categorical -> do nothing
 *   - if data type is number and array -> do nothing
 *
 *
 * @param data
 * @param configuration
 * @param callback
 */
exports.transfrom = function(data,configuration,callback){

    console.log(configuration);
    console.log(data);
    var configrations = configuration.data_description;

    //check vectors top dimensions
    var dimensions = configrations.filter(function(config){ return config.isStatic == false });
    console.log("Total dimensions " + dimensions.length);
    //console.log(dimensions);

    var result = [];
    //console.log(data.length);
    for (var i in data){

        //create empty vector with dimensions size
        var vector =  Array(dimensions.length).fill(0);
        //console.log(vector);
        var data_object = data[i];
        for(var key in data_object){
            var index = -1;
            var config =  dimensions.find(function(item,i){
                if(item.field_name === key.toLowerCase()){
                    index = i;
                    return item;
                }
            });

            if(index!=-1){
                if(config.type === "number"){
                    vector.splice(index, 1, data_object[key]);
                    //console.log(vector);
                }
                else if(config.isCategorical){
                    //console.log(config);
                    if(config.categorical_values!=undefined){
                        var binaryVector = encodeToBinary(data_object[key],config.categorical_values);
                        vector.splice(index, 1, binaryVector);
                    }
                }
                else if(config.type === "string"){
                    //Tokanization,stopwords removal, steaming
                   vector.splice(index,1, text2words(data_object[key],config.language));
                }

            }
        }
        result.push({original:data_object,vector:vector});
    }

    console.log(result);
    callback(result)
};

/**
 * This function encodes categorical values to binary array.
 * @param source - array of data
 * @param all_values - array of all possible data
 * @returns binary array
 */
function encodeToBinary(source,all_values){
    var vector =  Array(all_values.length).fill(0);
    for (var i in source){
        var index = all_values.indexOf(source[i]);
        vector.splice(index,1,1);
    }
    return vector;
};


/**
 * Tokanization, stopwordsremoval,steaming
 * @param text
 */
function text2words(text,language){

    switch(language){
        case 'sv':
            natural.PorterStemmerSv.attach();
            break;
        case 'en':
            natural.PorterStemmer.attach();
            break;
        case 'no':
            natural.PorterStemmerNo.attach();
            break;
        case 'ja':
            natural.StemmerJa.attach();
            break;
        case 'nl':
            natural.PorterStemmerNl.attach();
            break;
        default:
            natural.PorterStemmer.attach();
            break;
    }
    var words = text.tokenizeAndStem();
    return words;
};