const Question = require('../class/question');
const reponse = require('../class/reponse');
const Option = require('../class/option');
const GrpQuestion = require('../class/groupQuestion');
const regexReponse = /^(\=|\~)/;
const regexBon = /^(=)/;
const regexMulti = /\%.*?\%/;


module.exports = {
    questionParser: function questionParser(rawData) {
        let optionA = new Array();
        let question = null;
        let reponse = null;
        let stratA = null;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData.charAt(i) != undefined && rawData.charAt(i) == ':' && rawData.charAt(i + 1) == ':') {
                let indice = i + 2;
                while (rawData.charAt(indice) != undefined && rawData.charAt(indice) != ':' && rawData.charAt(indice + 1) != ':') {
                    indice++;
                }
                optionA.push(new Option("id", rawData.slice(i + 2, indice + 1)));
                i = indice + 3;

                let indiceG = i;
                while ((rawData.charAt(indiceG) != '{') || (rawData.charAt(indiceG - 1) == "\\" && rawData.charAt(indiceG) == "{")) {
                    indiceG++;
                }
                question = rawData.slice(i, indiceG).replace('\n', " ").replace('\r', " ").replace(/(\s*)/, "");
                i = indiceG;
            }

            if (rawData.charAt(i) != undefined && rawData.charAt(i) == '{') {
                let indice = i + 1;
                while ((rawData.charAt(indice) != '}') || (rawData.charAt(indice - 1) == "\\" && rawData.charAt(indice) == "}")) {
                    indice++;
                }
                let string = "{"+rawData.slice(i + 1, indice).replace(/[\n]/, "").replace(/[\r]/, "")+"}";
                //console.log("REPONSE ->"+string);
                if (string.match(/#(.*)/)!=null) {
                console.log("REPONSE ->" +string);
                for (let  i = 0 ; i < string.match(/#(.*)/).length;i++){
                    console.log("MATCH -> ["+i+"] "+string.match(/#(.*)[\n|\r|.]/)[0]);
                }
                
                }
                if (string.length > 5) {
                    if (string.match(regexMulti) != null) {
                        reponse = this.multiQuestionSeparateur(string);
                    } else {
                        reponse = this.separateurReponse(string);
                    }
                } else {
                    reponse = this.trueFalseSeparateur(string);
                }
                i = indice;
            }
        }
        return new Question(question, reponse, optionA, stratA);
    },
    separateurReponse: function separateurReponse(string) {
        let indice = 0;
        let array = new Array();
        let resArray = new Array();
        while (indice < string.length) {
            if (string.charAt(indice).match(regexReponse) != null && indice < string.length) {
                let tmp = string.charAt(indice);
                indice++;
                while (string.charAt(indice).match(regexReponse) == null && indice < string.length) {
                    tmp += string.charAt(indice);
                    indice++;
                }
                array.push(tmp.replace('\r', "").replace('\n', ""));
            } else {
                indice++;
            }
        }
        for (let i = 0; i < array.length; i++) {
            if (array[i].match(regexBon) != null) {
                resArray.push(new reponse(array[i].replace('=', ""), true));
            } else {
                resArray.push(new reponse(array[i].replace('~', ""), false));
            }
        }
        return resArray;
    },
    trueFalseSeparateur: function trueFalseSeparateur(char) {
        let reponseArray = new Array();
        if (char == 'T' || char == 't') {
            reponseArray.push(new reponse('vrai', true));
            reponseArray.push(new reponse('faux', false));
        } else {
            reponseArray.push(new reponse('vrai', false));
            reponseArray.push(new reponse('faux', true));
        }
        return reponseArray;
    },
    multiQuestionSeparateur: function multiQuestionSeparateur(string) {
        let indice = 0;
        let array = new Array();
        let resArray = new Array();
        while (indice < string.length) {
            if (string.charAt(indice).match(regexReponse) != null && indice < string.length) {
                let tmp = string.charAt(indice);
                indice++;
                while (string.charAt(indice).match(regexReponse) == null && indice < string.length) {
                    tmp += string.charAt(indice);
                    indice++;
                }
                array.push(tmp.replace('\r', "").replace('\n', ""));
            } else {
                indice++;
            }
        }
        for (let i = 0; i < array.length; i++) {
            if (array[i].match(/\%(.*?)\%/) != null) {
                if (array[i].match(/\%(.*?)\%/)[1].match(/-[0-9]{1,3}/) != null) {
                    resArray.push(new reponse(array[i].replace(regexMulti, "").replace(/[\=|\~]/, ""), false));
                } else {
                    resArray.push(new reponse(array[i].replace(regexMulti, "").replace(/[\=|\~]/, ""), true));
                }
            }
        }
        return resArray;
    },
    groupParser: function groupParser(string) {
        let titreGrp;
        let option = new Array();
        let grpQuestion = new Array();
        for (let i = 0; i < string.length; i++) {
            if (string.charAt(i) == "$") {
                if (string.slice(i, i + 9) == "$CATEGORY") {
                    let indice = i + 9;
                    while ((string.charAt(indice) != ':') || (string.charAt(indice + 1) != ':')) {
                        indice++;
                    }
                    titreGrp = string.slice(i + 10, indice)
                    while (titreGrp.match(/[\r\n\[\]\*\:\_]/) != null) {
                        titreGrp = titreGrp.replace(/[\r\n\[\]\*\:\_]/, "");
                    }
                    i = indice;
                }
            }

            if (string.charAt(i) == ':' && string.charAt(i + 1) == ':') {
                let indice = i;
                while ((string.charAt(indice) != '}') || (string.charAt(indice - 1) == "\\" && string.charAt(indice) == "}")) {
                    indice++;
                }
                grpQuestion.push(this.questionParser(string.slice(i, indice + 1)));
                i = indice;
            }
        }
        return new GrpQuestion(grpQuestion, option, titreGrp);
    },
    bodyParser: function bodyParser(dataRaw) {
        let grpArray = new Array();
        for (let i = 0; i < dataRaw.length; i++) {
            if (dataRaw.slice(i, i + 9) == "$CATEGORY") {
                let indice = i + 9
                while (indice < dataRaw.length && dataRaw.slice(indice, indice + 9) != "$CATEGORY") {
                    //console.log("DEBUG ->"+dataRaw.slice(indice,indice+9));
                    indice++;
                }
                grpArray.push(this.groupParser(dataRaw.slice(i, indice)));
                i = indice - 1;
            }

            if (dataRaw.charAt(i) != undefined && dataRaw.charAt(i) == ':' && dataRaw.charAt(i + 1) == ':') {
                let indice = i;
                while ((dataRaw.charAt(indice) != '}') || (dataRaw.charAt(indice - 1) == "\\" && dataRaw.charAt(indice) == "}")) {
                    indice++;
                }
                grpArray.push(this.questionParser(dataRaw.slice(i, indice + 1)));
                i = indice - 1;
            }
        }
        return grpArray;
    }
}
