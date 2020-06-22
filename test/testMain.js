const test = require('./inputReader.js');
const giftParser = require('../home_module/giftParser.js');
const amcTranslater = require('../home_module/amcTranslater');
const fs = require('fs');

let res = giftParser.bodyParser(test.testReader());
let cons = amcTranslater.bodyTranslator(res);
console.log(cons);
try{
   // fs.writeFileSync('./test/ouputTest.txt',JSON.stringify(res,null,2));
}catch(Exception){

}

