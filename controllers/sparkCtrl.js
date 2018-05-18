/**
 * Created by asoadmin on 2018-05-07.
 */
var eclairjs = require('eclairjs');

var spark = new eclairjs();

var sparkContext = spark.SparkContext("local[*]", "dataframe test");
var sqlContext = spark.sql.SQLContext(sparkContext);
