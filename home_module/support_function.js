const regexODT = /(.odt)$/;
const regexDOC = /(.doc)$/;
const regexTXT = /(.txt)$/;
const textract = require('textract');
var WordExtractor = require("word-extractor");
const fs = require('fs');


module.exports = {
    extensionSeeker: function extensionSeeker(orignalFileName) {
        let res;
        if (orignalFileName.match(regexODT) != null) {
            res = ".odt";
        } else if (orignalFileName.match(regexDOC) != null) {
            res = ".doc";
        } else if (orignalFileName.match(regexTXT) != null) {
            res = ".txt";
        } else {
            res = null;
        }
        return res;
    },
    asyncTextRact: function asyncTextRact(filePath, extension) {
        return new Promise(async (resolve, reject) => {
            const newPath = filePath + extension;
            fs.rename(filePath, newPath, () => {
                textract.fromFileWithPath(newPath, { 'preserveLineBreaks': true }, (err, res) => {
                    if (err) return reject(err);

                    resolve(res);
                });
            });
        });
    },
    wordExtract: function wordExtract(filePath) {
        return new Promise(async (resolve, reject) => {
            const newPath = filePath + ".doc";
            fs.rename(filePath, newPath, () => {
                var extractor = new WordExtractor();
                var extracted = extractor.extract(newPath);
                extracted.then(function (doc) {
                    resolve(doc.getBody());
                });
            });
        });
    },
    fileRemover: function fileRemover(filePath, typeFile) {
        try {
            fs.unlinkSync(filePath + typeFile);
        } catch (Exception) {
            console.error(Exception);
        }
    },
    fileReader:async function fileReader(originalFileName, filePath) {
        //req.file.originalname
        //req.file.path
        let typeFile = this.extensionSeeker(originalFileName);
        let rawDocument;
        switch (typeFile) {
            case ".txt":
                rawDocument = await this.asyncTextRact(filePath, typeFile);
                break;
            case ".odt":
                rawDocument = await this.asyncTextRact(filePath, typeFile);
                break;
            case ".doc":
                rawDocument = await this.wordExtract(filePath);
                break;
            default:
                rawDocument = null;
        }
        return rawDocument;
    }
}