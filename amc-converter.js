/*Importation des modules nécessaires pour le bon fonctionnement de l'application
* express = gestion des urls / body-parser = récupération des données passer en post
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const parser = require('./home_module/stringParser.js');
const translator = require('./home_module/gift_syntax.js');

var rawDocument = null;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('templates.ejs');
});

var fileDownload;

app.post('/convert', function (req, res) {
    rawDocument = req.body.coreFile;
    let idk = parser.headerParse(rawDocument);
    let question = translator.main(idk[2]);
    fileDownload = question;
    res.redirect("/download");
});

app.get('/download', function (req, res) {
    res.setHeader("Content-Disposition", `attachment; filename=importGift.txt`);
    res.send(fileDownload);
});

// app.post('/convert', function (req, res) {
//     rawDocument = req.body.coreFile;
//     console.log("rawDoc", rawDocument);
//     let idk = parser.headerParse(rawDocument);
//     let question = translator.main(idk[2]);
//     console.log("data", question);
//     fs.writeFileSync("./giftImport.txt", question);
//     res.redirect("/download");
// });

// app.get('/download', function (req, res) {
//     res.download('giftImport.txt', 'giftImport.txt', err => {
//         if (err != undefined){
//             console.error(err);
//         }
//     });
// });

app.listen(process.env.PORT||8080);
