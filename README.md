# Multidimensional Vector Space Model Microservice (MVSMM)

MVSMM is a nodejs application that implements vector space model.
### Features

  - Transforms original data to vectors
  - Computes similarity and gets closest vector in VSM

### Installation
MVSMM requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the server (default port 3003).
You can change port in bin/www file.

```sh
$ cd MVCMmicroservice
$ npm install -d
$ npm start
```

### Todo list

Future features:
   - Add support of other data types
   - Add Spark engine
   - Add text similarity algorithms
   - Design better algorithm for getting minimal distance vector
 
