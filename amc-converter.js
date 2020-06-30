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
//const session = require('express-session');
const regexLetter = /([A-Za-z0-9])/;
var rawDocument = null;
var fileDownload = null;


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/home', function (req, res) {
    res.render('homePage.ejs');
})

app.get('/fromAMC', function (req, res) {
    res.render('templatesAmc.ejs');
});

app.get('/fromGIFT', function (req, res) {
    res.render('templatesGift.ejs');
})

app.post('/convertAmc', upload.single('avatar'), async function (req, res) {
    let question = null;
    if (req.body.coreFile.match(regexLetter) != null) {
        rawDocument = req.body.coreFile;
        question = translator.main(parser.headerParse(rawDocument)[2]);
    } else if (req.file != null) {
        rawDocument = await support.fileReader(req.file.originalname, req.file.path);
        question = translator.main(parser.headerParse(rawDocument)[2]);
        support.fileRemover(req.file.path, support.extensionSeeker(req.file.originalname));
    } else {
        console.log('Aucun des cas');
    }
    fileDownload = question;
    res.redirect("/download");
});

app.post('/convertGift', upload.single('avatar'), async function (req, res) {
    let question;
    if (req.body.coreFile.match(regexLetter) != null) {
        rawDocument = req.body.coreFile;
        question = amcTranslater.bodyTranslator(giftParser.bodyParser(rawDocument));
    } else if (req.file != null) {
        rawDocument = await support.fileReader(req.file.originalname, req.file.path);
        question = await amcTranslater.bodyTranslator(giftParser.bodyParser(rawDocument));
        support.fileRemover(req.file.path, support.extensionSeeker(req.file.originalname));
    } else {
        console.log('Aucun des cas');
    }
    fileDownload = question;
    //res.redirect("/download");
});

app.get('/download', function (req, res) {
    res.setHeader("Content-Disposition", `attachment; filename=importConverter.txt`);
    res.send(fileDownload);
});

app.get('*', function (req, res) {
    res.redirect('/home');
})

app.listen(process.env.PORT || 8080);
