const express= require("express");
const path= require("path");
const fs = require("fs"); //file system
const sass = require("sass");
const sharp = require("sharp");

app= express();
app.set("view engine", "ejs")

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"Resurse/scss"),
    folderCss: path.join(__dirname,"Resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
}


console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

let vect_foldere=["temp", "logs", "backup", "fisiere_uploadate"]
for (let folder of vect_foldere){
    let caleFolder = path.join(__dirname, folder);
    if(!fs.existsSync(caleFolder)) {
        // fs.mkdirSync(caleFolder, {recursive: true});
        fs.mkdirSync(path.join(caleFolder), {recursive: true});
    }
}
// pt orice care care incepe cu /Resurse, trimite-mi fisierele 
// static pt ca nu vrem sa le modificam
app.use("/Resurse", express.static(path.join(__dirname, "Resurse")));
app.use("/dist", express.static(path.join(__dirname, "/node_modules/bootstrap/dist")));

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "Resurse/imagini/favicon/favicon.ico"))
});

app.get(["/", "/index", "/home"], function(req, res){
    // res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index", {
        ip:req.ip,
        imagini: obGlobal.obImagini.imagini
    });
});

app.get("/galerie", function(req, res){

    let posibile = [5, 7, 9, 11];
    let n = posibile[Math.floor(Math.random() * posibile.length)];

    let toateImaginile = obGlobal.obImagini.imagini;

    let nrFinal = Math.min(n, toateImaginile.length);
    if (nrFinal % 2 === 0 && nrFinal > 0) nrFinal--; 

    let imaginiAnimata = toateImaginile.slice(-nrFinal);

    let caleVarScss = path.join(obGlobal.folderScss, "_variabile-galerie.scss");
    fs.writeFileSync(caleVarScss, `$nr-imagini: ${nrFinal};\n`);

    let caleScssAnimata = path.join(obGlobal.folderScss, "galerie-animata.scss");
    if(fs.existsSync(caleScssAnimata)) {
        compileazaScss(caleScssAnimata);
    }

    res.render("pagini/galerie", {
        // imagini: obGlobal.obImagini.imagini
        imagini: toateImaginile, 
        imaginiAnimata: imaginiAnimata
    });
});

// app.get("/despre", function(req, res){
//     // res.sendFile(path.join(__dirname, "index.html"));
//     res.render("pagini/despre");
// });



app.get("/cale", function(req, res){
    console.log("Am primit o cerere GET pe /cale");
    res.send("<b style='color: red'>XD</b>"); //inchide automat conexiunea
});

app.get("/cale2", function(req, res){
    res.write("ceva"); // nu o inchide pana la .end()
    res.write("altceva");
    res.end();
});

app.get("/cale2/:a/:b", function(req, res){
    res.send(parseInt(req.params.a) + parseInt(req.params.b));
});

// function initErori(){
//     let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
//     let erori=obGlobal.obErori=JSON.parse(continut)
//     let err_default=erori.eroare_default
//     err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
//     for (let eroare of erori.info_erori){
//         eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
//     }

// }


function initErori() {
    let caleErori = path.join(__dirname, "Resurse/json/erori.json");

    if (!fs.existsSync(caleErori)) {
        console.error("fisierul json nu exista!");
        process.exit(1); 
    }

    let continut = fs.readFileSync(caleErori).toString("utf-8");

    let obiecteText = continut.split("{");
    for (let bloc of obiecteText) {
        let chei = [...bloc.matchAll(/"([^"]+)"\s*:/g)].map(m => m[1]);
        let unice = new Set(chei);
        if (chei.length !== unice.size) {
            console.error(`Proprietate duplicata: { ${bloc.substring(0, 50).replace(/\n/g, '')}...`);
        }
    }

    let erori = obGlobal.obErori = JSON.parse(continut);
    if (!erori.info_erori || !erori.cale_baza || !erori.eroare_default) {
        console.error("Proprietati lipsa!");
    }

    let err_default = erori.eroare_default;

    if (err_default && (!err_default.titlu || !err_default.text || !err_default.imagine)) {
        console.error("eroare in erori default");
    }

    let folderBazaAbsolut = path.join(__dirname, erori.cale_baza || "inexistent");
    if (!fs.existsSync(folderBazaAbsolut)) {
        console.error(`'cale_baza' nu exista la adresa: ${folderBazaAbsolut}`);
    } else {

        if (err_default && err_default.imagine && !fs.existsSync(path.join(folderBazaAbsolut, err_default.imagine))) {
            console.error(`nu exista imaginea default -> ${err_default.imagine}`);
        }

        let idSet = new Set();
        let idDuplicate = [];

        if (erori.info_erori) {
            for (let eroare of erori.info_erori) {
                
                if (eroare.imagine && !fs.existsSync(path.join(folderBazaAbsolut, eroare.imagine))) {
                    console.error(`Nu exista imagine pentru eroarea: ${eroare.identificator} -> ${eroare.imagine}`);
                }

                if (idSet.has(eroare.identificator)) {
                    idDuplicate.push(eroare);
                } else {
                    idSet.add(eroare.identificator);
                }
                eroare.imagine = path.join(erori.cale_baza, eroare.imagine);
            }
        }

        if (idDuplicate.length > 0) {
            console.error("exista erori cu ID-uri duplicate");
            for (let dup of idDuplicate) {
                let clona = { ...dup };
                delete clona.identificator; 
                console.error("erore duplicata: ", clona);
            }
        }
    }

    if (err_default) err_default.imagine = path.join(erori.cale_baza, err_default.imagine);
}


initErori()


function afisareEroare(res, identificator, titlu, text, imagine ){
     // cautam eroarea in vecTtor
    let eroare = obGlobal.obErori.info_erori.find(
        (elem) => elem.identificator == identificator
    )

    let errDefault = obGlobal.obErori.eroare_default;

    if(eroare?.status != "true")
        // res.status(eroare.identificator)
        res.status(eroare ? eroare.identificator : (identificator || 500));


    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });
}

app.get("/eroare", function(req, res){
    afisareEroare(res, 404, "titlu")
});

//nou-------------------------------------------------->
function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"Resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleGalerie=obGlobal.obImagini.cale_galerie

    let caleAbs=path.join(__dirname,caleGalerie);
    let caleAbsMediu=path.join(caleAbs, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    
    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_fisier.split("."); //"ceva.png" -> ["ceva", "png"]
        let caleFisAbs=path.join(caleAbs,imag.cale_fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", caleGalerie, "mediu", numeFis+".webp" )
        imag.fisier=path.join("/", caleGalerie, imag.cale_fisier )
        imag.alt=imag.titlu;
        
    }
    // console.log(obGlobal.obImagini)
}
initImagini();

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "Resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "Resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}

// test galerie animata
let caleVarScss = path.join(obGlobal.folderScss, "_variabile-galerie.scss");
if (!fs.existsSync(caleVarScss)) {
    fs.writeFileSync(caleVarScss, `$nr-imagini: 5;\n`);
}

//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

//--------------------------------------------------->

app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);

    if(req.url.startsWith("/Resurse") && path.extname(req.url) == ""){
        afisareEroare(res, 403);
        return;
    }

    if(path.extname(req.url) == ".ejs"){
        afisareEroare(res, 400);
        return;
    }

    try{
        res.render("pagini" + req.url, function(err, rezRandare){
            if(err){
                if(err.message.includes("Failed to lookup view")){
                    afisareEroare(res, 404)
                }
                else{
                    afisareEroare(res)
                }
            }
            else{
                res.send(rezRandare);
                console.log("Rezultat randare", req.url)
            }
        });
    }catch(err){
        if(err.message.includes("Cannot find modules")){
            afisareEroare(res, 404)
        }
        else{
            afisareEroare(res)
        }
    }
});
app.listen(8080);
console.log("Serverul a pornit!");