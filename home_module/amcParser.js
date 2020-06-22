const option = require('../class/option');
const Question = require('../class/question');
const reponse = require('../class/reponse');
const Groupe = require('../class/groupQuestion');
const regexQBegin = /^\*{1,2}/;
const regexScoreSrat = /\{(.*?)\}/;
const regexOpt = /\[(.*?)\]/;
const regexReponse = /^(\+|\-)/;
const regexVerbatim = /\[verbatim\]/;
const regexVerbatimFin = /\[\/verbatim\]/;
const bonRep = /(\+)/;
const regexBeginGrp = /^(\*\()/;
const regexOptGrp = /\[(.*?)\]/;
const regexTitleGrp = /\[==(.*?)==\]/;
const regexEndGrp = /(\*\))/;
const regexExclamation = /\!(.*?)\!/;

module.exports = {
    headerParse: function parseHeader(str) {
        const res = str.replace('\r', " ").split('\n');
        const arrayOption = new Array();
        const arrayComment = new Array();
        let i = 0;
        try {
            while (res[i].match(regexQBegin) == null && i < res.length) {
                if (res[i].charAt(0) == '#') {
                    arrayComment.push(res[i].replace('##', "").replace('\r', ""));
                } else {
                    if (res[i].match(':') != null) {
                        arrayOption.push(new option(res[i].split(':')[0], res[i].split(':')[1].replace('\r', "")));
                    }
                }
                i++;
            }
        } catch (Exception) {
            // Rien
        }
        let resArray = new Array();
        resArray.push(arrayOption);
        resArray.push(arrayComment);
        resArray.push(this.mainParser(res.slice(i, res.length)));
        return resArray;
    },
    mainParser: function mainParser(strArray) {
        let resArray = new Array();
        for (let i = 0; i < strArray.length; i++) {
            if (strArray[i] != null && strArray[i].match(regexBeginGrp) != null) {
                let indice = i + 1;
                while (strArray[indice].match(regexEndGrp) == null) {
                    indice++;
                }
                resArray.push(this.groupParser(strArray.slice(i, indice)));
                i = indice;
            }

            if (strArray[i].match(regexQBegin) != null && strArray[i].match(regexEndGrp) == null) {
                let indice = i + 1;
                try{
                    while (indice < strArray.length && strArray[indice].match(regexQBegin) == null && strArray[indice].match(regexBeginGrp) == null ) {
                        indice++;
                        console.log("DEBUG  "+strArray[indice]);
                    }
                }catch(Exception){
                    console.log("Avant ->"+strArray[indice-1]);
                    console.log("Après ->"+strArray[indice+1]);
                    console.log("Indice ->"+indice);
                    console.log("tab length ->"+strArray.length);
                }

                resArray.push(this.questionParser(strArray.slice(i,indice)));
                i=indice-1;
            }
        }
        return resArray;
    },
    questionParser: function questionParser(strArray) {
        var scoreStrat = new Array();
        var optionQuestion = new Array();
        var question = "";
        var reponseArray = new Array();

        for (let i = 0; i < strArray.length; i++) {

            let matchQBegin = strArray[i].match(regexQBegin);
            let matchRegexOpt = strArray[i].match(regexOpt);
            let matchRegexVerbatim = strArray[i].match(regexVerbatim);
            let matchRegexReponse = strArray[i].match(regexReponse);
            let matchRegexBrace = strArray[i].match(regexScoreSrat);
            let matchExclamation = strArray[i].match(regexExclamation);

            if (matchQBegin != null) {
                strArray[i] = strArray[i].replace(regexQBegin, "");
            }

            if (matchRegexOpt != null && matchRegexVerbatim == null && matchRegexReponse == null) {
                let arrayOpt = matchRegexOpt[1].split(',');
                for (let j = 0; j < arrayOpt.length; j++) {
                    optionQuestion.push(new option(arrayOpt[j].split('=')[0], arrayOpt[j].split('=')[1]));
                }
                strArray[i] = strArray[i].replace(regexOpt, "");
            }

            if (matchRegexBrace != null && matchRegexVerbatim == null && matchRegexReponse == null && matchExclamation==null) {
                let arrayBrace = matchRegexBrace[1].split(',');
                for (let k = 0; k < arrayBrace.length; k++) {
                    scoreStrat.push(new option(arrayBrace[k].split('=')[0], arrayBrace[k].split('=')[1]));
                }
                strArray[i] = strArray[i].replace(regexScoreSrat, "");
            }

            if (matchExclamation != null) {
                optionQuestion.push(new option("file",matchExclamation[1]));
                strArray[i] = strArray[i].replace(regexExclamation,"");
            }

            if (matchRegexReponse == null && strArray[i].length > 0 && matchRegexVerbatim == null) {
                question += strArray[i];
                question = question.replace('\r', " ");
            }

            if (matchRegexVerbatim != null) {
                let indice_ = i + 1;
                let verbatim = "";
                while (strArray[indice_].match(regexVerbatimFin) == null) {
                    verbatim += strArray[indice_];
                    indice_++;
                }
                i = indice_;
                optionQuestion.push(new option("verbatim",verbatim));
            }

            if (strArray[i].match(regexReponse) != null) {
                if (strArray[i].match(bonRep) != null) {
                    reponseArray.push(new reponse(strArray[i].replace('+', "").trim(), true));
                } else {
                    reponseArray.push(new reponse(strArray[i].replace('-', "").trim(), false));
                }
            }
        }
        return new Question(question, reponseArray, optionQuestion, scoreStrat);
    },
    groupParser: function groupParser(strArray) {
        var optionGrp = new Array();
        var titleGrp = null;
        var questions = new Array();
        for (let i = 0; i < strArray.length; i++) {
            let matchOptGrp = strArray[i].match(regexOptGrp);
            let matchTitle = strArray[i].match(regexTitleGrp);
            let matchQBegin = strArray[i].match(regexQBegin);

            if (strArray[i].match(regexBeginGrp) != null) {
                strArray[i] = strArray[i].replace(regexBeginGrp, "");
            }

            if (matchOptGrp != null && i == 0) {
                let options = matchOptGrp[1].split(',');
                for (let j = 0; j < options.length; j++) {
                    optionGrp.push(new option(options[j].split('=')[0], options[j].split('=')[1]));
                }
                strArray[i] = strArray[i].replace(regexOptGrp, "");
            }

            if (matchTitle != null) {
                titleGrp = matchTitle[1];
                strArray[i] = strArray[i].replace(regexTitleGrp, "");
            }

            if (strArray[i] != null && strArray[i].match('\s') != null && (matchQBegin != null) && strArray[i].match(regexEndGrp) == null) {
                let indice = i + 1;
                while ((strArray[indice] != null && strArray[indice].match(regexQBegin) == null) && indice < strArray.length) {
                    indice++;

                }
                questions.push(this.questionParser(strArray.slice(i, indice)));
                i = indice - 1;
            }
        }
        return new Groupe(questions, optionGrp, titleGrp);
    },
}
