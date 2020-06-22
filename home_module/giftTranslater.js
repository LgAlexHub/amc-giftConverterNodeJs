const regexScoreSrat = /\{(.*?)\}/;
const group = require("../class/groupQuestion");
const GroupeQuestion = require("../class/groupQuestion");
module.exports = {
    questionATitre: function questionATitre(arrayOption) {
        let option = null;
        for (let i = 0; i < arrayOption.length; i++) {
            if (arrayOption[i].getNomOption() == "id") {
                option = arrayOption[i].getValeur();
            }
        }
        return option;
    },
    questionType: function questionType(questionObject) {
        let type = null;
        if (questionObject.getStrat().length > 0) {
            type = "questionScore";
        } else {
            let j = 0;
            let arrayReponse = questionObject.getReponse();
            for (let i = 0; i < arrayReponse.length; i++) {
                if (arrayReponse[i].getRight() == true) {
                    j++;
                }
            }
            if (j > 1) {
                type = "questionMultiple";
            } else {
                type = "questionSimple";
            }
        }
        if (questionObject.getQuestion().match(/\<(.*?)\>/) != null) {
            type = "openQuestion";
        }
        return type;
    },
    SimplequestionTranslater: function SimplequestionTransaler(questionObject, num) {
        let titre = this.questionATitre(questionObject.getOption());
        let category = null;
        let reponseArray = questionObject.getReponse();
        let resArray = new Array();
        let verba = this.getVerbatim(questionObject.getOption());
        if (titre == null) {
            titre = "Q" + num;
        }
        resArray.push("::" + titre + ":: " + questionObject.getQuestion());
        if (verba != null) {
            resArray.push(verba);
        }
        resArray.push("{");
        for (let i = 0; i < reponseArray.length; i++) {
            if (reponseArray[i].getRight() == true) {
                resArray.push("=" + reponseArray[i].getReponse() + " ");
            } else {
                resArray.push("~" + reponseArray[i].getReponse() + " ");
            }
        }
        resArray.push("}\n");
        return resArray.join('\n');
    },
    basicMultipleQuestion: function basicMultipleQuestion(questionObj, num) {
        let reponseArray = questionObj.getReponse();
        let resArray = new Array();
        let verba = this.getVerbatim(questionObj.getOption());
        let titre = this.questionATitre(questionObj.getOption());
        if (titre == null) {
            titre = "Q" + num;
        }
        resArray.push("::" + titre + ":: " + questionObj.getQuestion());
        if (verba != null) {
            resArray.push(verba);
        }
        resArray.push("{");
        let j = 0;
        for (let i = 0; i < reponseArray.length; i++) {
            if (reponseArray[i].getRight() == true) {
                j++;
            }
        }
        for (let i = 0; i < reponseArray.length; i++) {
            if (reponseArray[i].getRight() == true) {
                resArray.push("~%" + (100 / j) + "%" + reponseArray[i].getReponse() + " ");
            } else {
                resArray.push("~%-100%" + reponseArray[i].getReponse() + " ");
            }
        }
        resArray.push("}\n");
        return resArray.join('\n');
    },
    stratQuestion: function stratQuestion(questionObj, num) {
        let reponseArray = questionObj.getReponse();
        let resArray = new Array();
        let titre = this.questionATitre(questionObj.getOption());
        let stratArray = this.getStrat(questionObj.getStrat());
        let verba = this.getVerbatim(questionObj.getOption());

        if (titre == null) {
            titre = "Q" + num;
        }
        resArray.push("::" + titre + ":: " + questionObj.getQuestion());
        if (verba != null) {
            resArray.push(verba);
        }
        resArray.push("{");
        let j = 0;
        for (let i = 0; i < reponseArray.length; i++) {
            if (reponseArray[i].getRight() == true) {
                j++;
            }
        }
        for (let i = 0; i < reponseArray.length; i++) {
            if (reponseArray[i].getRight() == true) {
                resArray.push("~%100%" + reponseArray[i].getReponse().replace(regexScoreSrat, "").trim() + " ");
            }  else {
                resArray.push("~%-100%" + reponseArray[i].getReponse().replace(regexScoreSrat, "").trim() + " ");
            }
        }
        /*
        else if (reponseArray[i].getRight() == false && reponseArray[i].getReponse().match(regexScoreSrat) != null) {
                resArray.push("~%" + (100 * reponseArray[i].getReponse().match(regexScoreSrat)[1]) + "%" + reponseArray[i].getReponse().replace(regexScoreSrat, "").trim() + " ");
                console.log("DEBUG: "+100 * reponseArray[i].getReponse().match(regexScoreSrat)[1]);
            }
        */
        resArray.push("}\n");
        return resArray.join('\n');
    },
    getStrat: function getStrat(stratArray) {
        const regex = /(-)/;
        if (stratArray[0].getValeur().match(regex) != null) {
            return [stratArray[1], stratArray[0]];
        } else {
            return stratArray;
        }
    },
    getVerbatim: function getVerbatim(optionArray) {
        let verbatim = null;
        for (let i = 0; i < optionArray.length; i++) {
            if (optionArray[i].getNomOption() == "verbatim") {
                verbatim = optionArray[i].getValeur();
            }
        }
        if (verbatim != null) {
            let regexArray = [/({)/, /(})/, /(~)/, /(=)/, /(#)/, /(:)/];
            for (let i = 0; i < regexArray.length; i++) {
                if (verbatim.match(regexArray[i]) != null) {
                    verbatim = verbatim.replace(regexArray[i], '\\' + verbatim.match(regexArray[i])[1]);
                }
            }
        }
        return verbatim;
    },
    main: function main(mainParserArray) {
        const regexTitre = /[(\\)(\*)(\/)(\_)(\()(\))(\[)(\])(\.)(\-)(\")(\')(\~)(\:)(\,)(\@)(\°)(\+)(\=)(\<)(\>)(\!)(\?)(\;)]/;
        let grpArray = new Array();
        let singleArray = new Array();
        let j = 1;
        for (let i = 0; i < mainParserArray.length; i++) {

            if (mainParserArray[i] instanceof GroupeQuestion) {
                
                let grpTitle = mainParserArray[i].getTitre();
                if (grpTitle != null) {
                    grpArray.push("$CATEGORY: " + grpTitle.trim()+'\n');
                } else {
                    grpArray.push("$CATEGORY: SansCategorie \n");
                }
                j++;
                let questionArray = mainParserArray[i].getGroupeQ();
                for (let k = 0; k < questionArray.length; k++) {
                    let question = this.autoQuestionTranslater(questionArray[k], (i + "" + k));
                    if (question != null) {
                        grpArray.push(question);
                    }
                }
            } else {
                let question = this.autoQuestionTranslater(mainParserArray[i].getQuestion(), i);
                if (question != null) {
                    singleArray.push(question);
                }
            }
            return singleArray.join('\n') + grpArray.join('\n');
        }

    },
    autoQuestionTranslater: function autoQuestionTranslater(questionObj, num) {
        let typeQ = this.questionType(questionObj);
        let question = null;
        switch (typeQ) {
            case "questionScore":
                question = this.stratQuestion(questionObj, num);
                break;
            case "questionSimple":
                question = this.SimplequestionTranslater(questionObj, num);
                break;
            case "questionMultiple":
                question = this.basicMultipleQuestion(questionObj, num);
                break;
            case "openQuestion":
                //Rien je sais pas encore le faire
                break;
            default:
                // Au cas où
                break;
        }
        return question;
    }
}