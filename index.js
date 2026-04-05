const express= require("express");
const path= require("path");
const fs = require("fs"); //file system
const sass = require("sass");

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

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "Resurse/imagini/favicon/favicon.ico"))
});

app.get(["/", "/index", "/home"], function(req, res){
    // res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index", {
        ip:req.ip
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

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }

}
initErori()


function afisareEroare(res, identificator, titlu, text, imagine ){
     // cautam eroarea in vecTtor
    let eroare = obGlobal.obErori.info_erori.find(
        (elem) => elem.identificator == identificator
    )

    let errDefault = obGlobal.obErori.eroare_default;

    if(eroare?.status != "true")
        res.status(eroare.identificator)

    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });
}

app.get("/eroare", function(req, res){
    afisareEroare(res, 404, "titlu")
});


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
                    afisareEroare(err, 404)
                }
                else{
                    afisareEroare(res)
                }
            }
            else{
                res.render(rezRandare);
                console.log("Rezultat randare", rezRandare)
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