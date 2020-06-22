const fs = require('fs');
module.exports={
    testReader:function testReader(){
        let res = null ; 
        try{
            res = fs.readFileSync('test\\input.txt',{'encoding':'utf-8'});
        }catch(Exception){
            console.log(Exception);
        }
        return res;
    }
}

