/*Importation des modules nécessaires pour le bon fonctionnement de l'application
* express = gestion des urls / body-parser = récupération des données passer en post
*/
const parser = require('./home_module/amcParser.js');
const translator = require('./home_module/giftTranslater.js');
const support = require('./home_module/support_function.js');
const giftParser = require('./home_module/giftParser.js');
const amcTranslater = require('./home_module/amcTranslater.js');

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const session = require('express-session');
const giftTranslater = require('./home_module/giftTranslater.js');
const regexLetter = /([A-Za-z0-9])/;
var rawDocument = null;
var fileDownload;


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/home',function(req,res){
    res.render('homePage.ejs');
})

app.get('/fromAMC', function (req, res) {
    res.render('templatesAmc.ejs');
});

app.get('/fromGIFT', function(req,res){
    res.render('templatesGift.ejs');
})

app.post('/convertAmc', upload.single('avatar'), async function (req, res) {
    let question;
    let idk;
    if (req.body.coreFile.match(regexLetter) != null) {
        rawDocument = req.body.coreFile;
        idk = parser.headerParse(rawDocument);
        question = translator.main(idk[2]);
    } else if (req.file != null) {
        let typeFile = support.extensionSeeker(req.file.originalname);
        switch (typeFile) {
            case ".txt":
                rawDocument = await support.asyncTextRact(req.file.path, typeFile);
                break;
            case ".odt":
                rawDocument = await support.asyncTextRact(req.file.path, typeFile);
                break;
            case ".doc":
                rawDocument = await support.wordExtract(req.file.path);
        }
        idk = parser.headerParse(rawDocument);
        question = translator.main(idk[2]);
        try {
            fs.unlinkSync(req.file.path + typeFile);
        } catch (Exception) {
            console.error(Exception);
        }
    } else {
        console.log('Aucun des cas');
    }
    fileDownload = question;
    res.redirect("/download");
});

app.post('/convertGift', upload.single('avatar'), async function (req, res) {
    let question;
    let idk;
    if (req.body.coreFile.match(regexLetter) != null) {
        rawDocument = req.body.coreFile;
        idk = giftParser.bodyParser(rawDocument);
        question = amcTranslater.bodyTranslator(idk)
    } else if (req.file != null) {
        let typeFile = support.extensionSeeker(req.file.originalname);
        switch (typeFile) {
            case ".txt":
                rawDocument = await support.asyncTextRact(req.file.path, typeFile);
                break;
            case ".odt":
                rawDocument = await support.asyncTextRact(req.file.path, typeFile);
                break;
            case ".doc":
                rawDocument = await support.wordExtract(req.file.path);
        }
        idk = giftParser.bodyParser(rawDocument);
        question = amcTranslater.bodyTranslator(idk)
        try {
            fs.unlinkSync(req.file.path + typeFile);
        } catch (Exception) {
            console.error(Exception);
        }
    } else {
        console.log('Aucun des cas');
    }
    fileDownload = question;
    res.redirect("/download");
});

app.get('/download', function (req, res) {
    res.setHeader("Content-Disposition", `attachment; filename=importConverter.txt`);
    res.send(fileDownload);
});

app.get('*',function(req,res){
    res.redirect('/home');
})

app.listen(process.env.PORT || 8080);
