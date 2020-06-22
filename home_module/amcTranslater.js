const question = require('../class/question');
const grpQuestion = require('../class/groupQuestion');

module.exports = {
    questionTranslator: function questionTranslator(questionObj) {
        let returnString = "";
        let optionArray = questionObj.getOption();
        let reponseArray = questionObj.getReponse();
        let titre =questionObj.getQuestion()
        if (questionObj.isMultipleReponse() == true) {
            returnString += "**";
        } else {
            returnString += "*";
        }

        if (optionArray.length > 0) {
            returnString += '[';
            for (let i = 0; i < optionArray.length; i++) {
                returnString += optionArray[i].getNomOption() + '=' + optionArray[i].getValeur() + ",";
            }
            returnString += ']';
        }  
        returnString += titre+'\n';

        for (let i = 0; i < reponseArray.length; i++) {
            if (reponseArray[i].getRight()==true){
                returnString+='+'+reponseArray[i].getReponse()+'\n';
            }else{
                returnString+='-'+reponseArray[i].getReponse()+'\n';
            }
        }
        return returnString;
    },
    groupTranslater:function groupTranslater(groupObj){
        let optionArray = groupObj.getOption();
        let questionArray=groupObj.getGroupeQ();
        let titre = groupObj.getTitre();
        let returnString = "*(";
        if (optionArray.length >0 ) {
            returnString += '[';
            for (let i= 0 ; i< optionArray.length ; i++){
                returnString+= optionArray[i].getNomOption()+'='+optionArray[i].getValeur()+',';
            }
            returnString+=']';
        }

        if (titre != null && titre !=undefined){
            returnString +="[=="+titre+"==]\n"
        }

        for (let i = 0 ; i < questionArray.length; i++) {
            returnString+=this.questionTranslator(questionArray[i]);
        }

        returnString+="*)\n";
        return returnString;
        
    },
    bodyTranslator:function bodyTranslator(array){
        let returnString = "";
        for (let i = 0 ; i < array.length ;i++) {
            if (array[i] instanceof grpQuestion) {
                returnString+=this.groupTranslater(array[i]);
            }else if (array[i] instanceof question) {
                returnString+=this.questionTranslator(array[i]);
            }
        }
        return returnString;
    }
}