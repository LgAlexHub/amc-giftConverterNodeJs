module.exports=class Reponse{
    constructor(reponseStr,right){
        this.reponseStr=reponseStr;
        this.right=right;
    }

    getReponse(){
        return this.reponseStr;
    }

    getRight(){
        return this.right;
    }

    setReponse(str){
        this.reponseStr=str;
    }

    setRigh(right){
        this.righ=right;
    }
}